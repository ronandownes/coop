---
layout: doc
title: "MS4215 — Week 2"
eyebrow: "ADVANCED DATA ANALYSIS · WEEK 2"
study_mode: true
---

[← MS4215 resources]({{ '/modules/ms4215-advanced-data-analysis.html' | relative_url }}) · [Week 02A slides]({{ '/resources/ms4215/lectures/Week_02A.pdf' | relative_url }}) · [Week 02B slides]({{ '/resources/ms4215/lectures/Week_02B.pdf' | relative_url }}) · [Lab 2 teaching page]({{ '/education/ms4215/lab-02.html' | relative_url }})

Week 2 moves from **correlation and simple linear regression** to **multiple linear regression**. The important progression is not more software commands; it is learning what changes when several predictors are considered at the same time.

## Week 2A | Correlation and simple linear regression

A scatter plot comes first. Ask about **direction, form and strength** before calculating a correlation coefficient.

Pearson correlation measures the strength of a **linear** association. It is dimensionless and lies between -1 and 1. A value near zero means little linear association; it does not rule out a curved relationship.

Correlation does not establish causation. A relationship may reflect a direct causal mechanism, a common cause, reverse direction or coincidence.

Simple linear regression goes further by fitting

```
predicted outcome = intercept + slope × predictor
```

The slope gives a change in the predicted outcome per one-unit increase in the predictor. Ordinary least squares chooses the line that minimises the sum of squared residuals.

The lecturer uses **R** and `lm()`. In Python the corresponding statistical tool is `statsmodels`.

## Week 2B | Multiple linear regression

Separate simple regressions can be misleading when predictors are related to one another.

Multiple regression fits several predictors in one model:

```
Y = β0 + β1X1 + β2X2 + ... + ε
```

Each coefficient is interpreted **holding the other included predictors constant**. That phrase is central to the course.

The Week 2B earnings example shows why this matters: a simple relationship between height and earnings can change after another relevant variable is included.

## R and Python together

Use R for the module because that is the lecturer's language. Then reproduce the same analysis in Python. The objective is to see the statistical structure underneath both interfaces.

| Idea | R | Python |
|:--|:--|:--|
| Correlation | `cor(x, y)` | `Series.corr()` |
| Linear model | `lm(y ~ x)` | `statsmodels.OLS()` |
| Model summary | `summary(model)` | `model.summary()` |
| Coefficients | `coef(model)` | `model.params` |
| Residuals | `residuals(model)` | `model.resid` |

## What to understand before Lab 2

Before doing Lab 2, Erik should be comfortable explaining:

1. the difference between correlation and regression;
2. why correlation is not causation;
3. what a regression intercept and slope mean;
4. what a residual is;
5. why several predictors may belong in one model;
6. what “holding the other predictors constant” means.

The [Lab 2 teaching page]({{ '/education/ms4215/lab-02.html' | relative_url }}) then connects these ideas to the design matrix, the OLS matrix formula, significance tests and VIF.
