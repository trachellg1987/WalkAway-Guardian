-- ============================================================================
-- WALK-AWAY GUARDIAN ANALYTICS SQL QUERIES
-- ============================================================================
-- Demonstrates hands-on SQL expertise for data extraction, transformation,
-- and aggregation required for GS-11 Data Scientist position
-- 
-- Queries show:
-- - Complex joins and filtering
-- - Aggregation and grouping operations
-- - Window functions for trend analysis
-- - Derived metric calculation
-- ============================================================================


-- ============================================================================
-- QUERY 1: USER CONVERSION ANALYSIS BY DEVICE TYPE
-- ============================================================================
-- Purpose: Extract and analyze conversion metrics stratified by device type
-- Demonstrates: GROUP BY, aggregation functions, calculated fields
-- Context: Used to identify mobile vs. desktop performance gaps

SELECT 
    u.device_type,
    COUNT(DISTINCT u.user_id) AS total_users,
    COUNT(DISTINCT s.session_id) AS total_sessions,
    SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) AS conversions,
    ROUND(
        SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) * 100.0 / 
        NULLIF(COUNT(DISTINCT s.session_id), 0), 
        2
    ) AS conversion_rate_percent,
    ROUND(AVG(s.session_duration_seconds), 0) AS avg_session_duration,
    ROUND(AVG(CASE WHEN c.conversion_occurred = 1 THEN s.session_duration_seconds END), 0) 
        AS avg_session_duration_converters,
    ROUND(100.0 * SUM(CASE WHEN s.bounce_event = 1 THEN 1 ELSE 0 END) / 
        NULLIF(COUNT(DISTINCT s.session_id), 0), 2) AS bounce_rate_percent

FROM users u
    LEFT JOIN sessions s ON u.user_id = s.user_id
    LEFT JOIN conversions c ON s.session_id = c.session_id
    
WHERE u.created_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
    AND s.session_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)

GROUP BY u.device_type
ORDER BY conversion_rate_percent DESC;


-- ============================================================================
-- QUERY 2: TREND ANALYSIS - DAILY CONVERSION RATES
-- ============================================================================
-- Purpose: Track conversion rate trends over time to identify patterns
-- Demonstrates: DATE functions, aggregation, trend calculation
-- Context: Used for forecasting and identifying optimization opportunities

SELECT 
    DATE(s.session_date) AS activity_date,
    u.device_type,
    COUNT(DISTINCT s.session_id) AS daily_sessions,
    SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) AS daily_conversions,
    ROUND(
        100.0 * SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) / 
        NULLIF(COUNT(DISTINCT s.session_id), 0),
        2
    ) AS daily_conversion_rate,
    -- 7-day moving average
    ROUND(
        AVG(
            100.0 * SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) / 
            NULLIF(COUNT(DISTINCT s.session_id), 0)
        ) OVER (
            PARTITION BY u.device_type 
            ORDER BY DATE(s.session_date) 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ),
        2
    ) AS moving_avg_7day

FROM sessions s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN conversions c ON s.session_id = c.session_id

WHERE s.session_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)

GROUP BY activity_date, u.device_type
ORDER BY activity_date DESC, u.device_type;


-- ============================================================================
-- QUERY 3: USER COHORT RETENTION ANALYSIS
-- ============================================================================
-- Purpose: Identify user retention patterns by cohort
-- Demonstrates: Window functions, CTE, complex filtering
-- Context: Used for churn prediction and lifecycle analysis

WITH user_cohorts AS (
    SELECT 
        u.user_id,
        DATE_TRUNC(u.created_date, MONTH) AS cohort_month,
        EXTRACT(MONTH FROM DATE_DIFF(s.session_date, u.created_date, MONTH)) AS months_since_signup
    FROM users u
    LEFT JOIN sessions s ON u.user_id = s.user_id
    WHERE u.created_date >= DATE_SUB(CURRENT_DATE, INTERVAL 12 MONTH)
)

SELECT 
    cohort_month,
    months_since_signup,
    COUNT(DISTINCT user_id) AS users_active,
    ROUND(
        100.0 * COUNT(DISTINCT user_id) / 
        FIRST_VALUE(COUNT(DISTINCT user_id)) OVER (
            PARTITION BY cohort_month 
            ORDER BY months_since_signup
        ),
        2
    ) AS retention_rate_percent

FROM user_cohorts
WHERE months_since_signup IS NOT NULL

GROUP BY cohort_month, months_since_signup
ORDER BY cohort_month DESC, months_since_signup;


-- ============================================================================
-- QUERY 4: FEATURE ENGAGEMENT ANALYSIS
-- ============================================================================
-- Purpose: Analyze usage and conversion impact of specific features
-- Demonstrates: Complex joins, feature flag analysis, impact calculation
-- Context: Used for product optimization and roadmap prioritization

SELECT 
    f.feature_name,
    f.feature_version,
    COUNT(DISTINCT u.user_id) AS users_exposed,
    COUNT(DISTINCT s.session_id) AS sessions_with_feature,
    ROUND(AVG(s.session_duration_seconds), 0) AS avg_session_duration,
    SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) AS conversions,
    ROUND(
        100.0 * SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) / 
        NULLIF(COUNT(DISTINCT s.session_id), 0),
        2
    ) AS feature_conversion_rate,
    -- Comparison to baseline (no feature)
    ROUND(
        (100.0 * SUM(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END) / 
        NULLIF(COUNT(DISTINCT s.session_id), 0)) -
        (SELECT 
            100.0 * SUM(CASE WHEN c2.conversion_occurred = 1 THEN 1 ELSE 0 END) / 
            NULLIF(COUNT(DISTINCT s2.session_id), 0)
        FROM sessions s2
        LEFT JOIN conversions c2 ON s2.session_id = c2.session_id
        WHERE s2.feature_id IS NULL),
        2
    ) AS conversion_lift_vs_baseline

FROM feature_flags f
    JOIN sessions s ON s.feature_flag_id = f.feature_flag_id
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN conversions c ON s.session_id = c.session_id

WHERE f.rollout_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)
    AND s.session_date >= f.rollout_date

GROUP BY f.feature_name, f.feature_version
HAVING COUNT(DISTINCT s.session_id) >= 100  -- Minimum sample size
ORDER BY feature_conversion_rate DESC;


-- ============================================================================
-- QUERY 5: SESSION QUALITY METRICS (ENGAGEMENT SCORING)
-- ============================================================================
-- Purpose: Calculate composite engagement score for user sessions
-- Demonstrates: Complex calculated fields, percentile scoring, ranking
-- Context: Used for predicting conversion likelihood

SELECT 
    s.session_id,
    u.user_id,
    u.device_type,
    s.session_duration_seconds,
    COUNT(DISTINCT e.event_id) AS total_events,
    SUM(CASE WHEN e.event_type = 'page_view' THEN 1 ELSE 0 END) AS page_views,
    SUM(CASE WHEN e.event_type = 'button_click' THEN 1 ELSE 0 END) AS button_clicks,
    SUM(CASE WHEN e.event_type = 'form_start' THEN 1 ELSE 0 END) AS form_starts,
    SUM(CASE WHEN e.event_type = 'feature_usage' THEN 1 ELSE 0 END) AS feature_uses,
    -- Engagement Score: weighted combination of behaviors
    ROUND(
        (COUNT(DISTINCT e.event_id) * 0.2) +
        (SUM(CASE WHEN e.event_type = 'page_view' THEN 1 ELSE 0 END) * 0.1) +
        (SUM(CASE WHEN e.event_type = 'button_click' THEN 1 ELSE 0 END) * 0.3) +
        (SUM(CASE WHEN e.event_type = 'form_start' THEN 1 ELSE 0 END) * 0.4),
        2
    ) AS engagement_score,
    -- Percentile ranking (0-100)
    ROUND(
        100 * PERCENT_RANK() OVER (ORDER BY COUNT(DISTINCT e.event_id)),
        0
    ) AS engagement_percentile,
    c.conversion_occurred,
    CASE 
        WHEN c.conversion_occurred = 1 THEN 'Converted'
        ELSE 'Did Not Convert'
    END AS conversion_status

FROM sessions s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN events e ON s.session_id = e.session_id
    LEFT JOIN conversions c ON s.session_id = c.session_id

WHERE s.session_date >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY)

GROUP BY s.session_id, u.user_id, u.device_type, s.session_duration_seconds, 
         c.conversion_occurred

ORDER BY engagement_score DESC;


-- ============================================================================
-- QUERY 6: STATISTICAL SUMMARY FOR HYPOTHESIS TESTING
-- ============================================================================
-- Purpose: Generate summary statistics for mobile vs. desktop comparison
-- Demonstrates: Aggregate functions, percentile calculation
-- Context: Supports statistical testing (t-tests, Mann-Whitney U)

SELECT 
    u.device_type,
    COUNT(DISTINCT s.session_id) AS n_sessions,
    ROUND(AVG(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS mean_conversion_rate,
    ROUND(STDDEV(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS stddev_conversion_rate,
    ROUND(MIN(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS min_conversion,
    ROUND(PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY 
        CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS q1_conversion,
    ROUND(PERCENTILE_CONT(0.50) WITHIN GROUP (ORDER BY 
        CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS median_conversion,
    ROUND(PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY 
        CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS q3_conversion,
    ROUND(MAX(CASE WHEN c.conversion_occurred = 1 THEN 1 ELSE 0 END), 4) AS max_conversion

FROM sessions s
    JOIN users u ON s.user_id = u.user_id
    LEFT JOIN conversions c ON s.session_id = c.session_id

WHERE s.session_date >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)

GROUP BY u.device_type
ORDER BY mean_conversion_rate DESC;


-- ============================================================================
-- QUERY 7: DATA QUALITY & COMPLETENESS CHECK
-- ============================================================================
-- Purpose: Validate data quality for analysis
-- Demonstrates: Data governance, validation queries
-- Context: Ensures analytical integrity

SELECT 
    'users' AS table_name,
    COUNT(*) AS total_records,
    COUNT(DISTINCT user_id) AS distinct_users,
    ROUND(100.0 * (1 - COUNT(DISTINCT user_id) / NULLIF(COUNT(*), 0)), 2) AS duplicate_rate_percent,
    COUNTIF(created_date IS NULL) AS null_created_date,
    COUNTIF(device_type IS NULL) AS null_device_type,
    MIN(created_date) AS earliest_record,
    MAX(created_date) AS latest_record

FROM users

UNION ALL

SELECT 
    'sessions' AS table_name,
    COUNT(*) AS total_records,
    COUNT(DISTINCT session_id) AS distinct_sessions,
    ROUND(100.0 * (1 - COUNT(DISTINCT session_id) / NULLIF(COUNT(*), 0)), 2) AS duplicate_rate_percent,
    COUNTIF(user_id IS NULL) AS null_user_id,
    COUNTIF(session_duration_seconds IS NULL) AS null_duration,
    MIN(session_date) AS earliest_record,
    MAX(session_date) AS latest_record

FROM sessions

UNION ALL

SELECT 
    'conversions' AS table_name,
    COUNT(*) AS total_records,
    COUNT(DISTINCT conversion_id) AS distinct_conversions,
    ROUND(100.0 * (1 - COUNT(DISTINCT conversion_id) / NULLIF(COUNT(*), 0)), 2) AS duplicate_rate_percent,
    COUNTIF(session_id IS NULL) AS null_session_id,
    COUNTIF(conversion_occurred IS NULL) AS null_conversion_flag,
    MIN(conversion_date) AS earliest_record,
    MAX(conversion_date) AS latest_record

FROM conversions;
