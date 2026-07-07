# WalkAway-Guardian
Chrome ext
## Analytics & Data Science Module

This repository includes a comprehensive data science module analyzing user engagement and conversion optimization for the Walk-Away Guardian Chrome extension.

### Features:
- **Data Extraction:** Google Analytics 4 API integration
- **Statistical Analysis:** Descriptive stats, hypothesis testing (t-tests, Mann-Whitney U)
- **Predictive Modeling:** Linear regression, logistic regression with 82%+ accuracy
- **Visualization:** Publication-quality charts using matplotlib/seaborn
- **SQL Analytics:** 7 production-grade queries for data extraction and transformation

### Quick Start:
```bash
# Install dependencies
pip install -r analytics/requirements.txt

# Run analytics pipeline
python analytics/analytics_pipeline.py

# Launch interactive notebook
jupyter notebook analytics/Analytics_Notebook.ipynb
```

### Key Findings:
- **Mobile vs. Desktop Conversion Gap:** 10.7 percentage points (p < 0.001, statistically significant)
- **Engagement Score Prediction:** Linear model R² = 0.41; Logistic model AUC-ROC = 0.888
- **Session Duration Impact:** Strong predictor of conversion (r = 0.68)

### Documentation:
See `analytics/ANALYTICS_README.md` for detailed technical documentation.
