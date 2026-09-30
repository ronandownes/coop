---
layout: doc
title: "MS4215 — Lab 2: Espresso Extraction"
eyebrow: "ADVANCED DATA ANALYSIS · LAB 2"
study_mode: true
---

[← MS4215 resources]({{ '/modules/ms4215-advanced-data-analysis.html' | relative_url }}) · [Original Lab 2 PDF]({{ '/resources/ms4215/labs/lab_2_questions.pdf' | relative_url }}) · [Espresso CSV]({{ '/resources/ms4215/data/espresso.csv' | relative_url }}) · [Espresso Google Sheet](https://docs.google.com/spreadsheets/d/1cQJ-lTF_SWdBG3GXXLfz677YAu8RrgY7C8bCbZyO9Zc/edit) · [Open the Python notebook in Colab](https://colab.research.google.com/github/ronandownes/coop/blob/main/resources/ms4215/notebooks/MS4215_Lab2_Espresso_R_to_Python.ipynb)

The lecturer's lab is written in **R**. This page keeps that as the primary version and then translates every important idea into Python. The aim is not to replace R. It is to understand the statistics well enough to recognise the same method in another language.

## The question

The dataset contains 15 espresso shots. The response is **extraction yield**. The predictors are **grind size**, **water temperature** and **shot time**.

The analysis asks which brewing parameters are associated with extraction after the other included variables are controlled.

## 1 | Design matrix

Multiple regression can be written as:

```
y = Xβ + ε
```

The design matrix has one row per espresso shot. Its first column is all ones for the intercept, followed by the three predictor columns.

R:

```r
y <- espresso$extraction_yield
X <- cbind(1, espresso$grind_size, espresso$water_temp, espresso$shot_time)
```

Python:

```python
y = espresso["extraction_yield"].to_numpy()
X = np.column_stack([
    np.ones(len(espresso)),
    espresso["grind_size"],
    espresso["water_temp"],
    espresso["shot_time"]
])
```

## 2 | The matrix calculation

Ordinary least squares gives:

```
β̂ = (X'X)^(-1)X'y
```

The lab deliberately makes students calculate this before using `lm()`. That is useful because it shows that the software is implementing a defined mathematical operation.

R uses `t(X) %*% X` and `solve()`. Python uses `X.T @ X` and `np.linalg.inv()`.

## 3 | Fitted model

For the supplied data the fitted equation is approximately:

```
extraction_yield
= 13.864
  - 0.0361 × grind_size
  + 0.2696 × water_temp
  + 0.0385 × shot_time
```

The crucial interpretation is **holding the other predictors constant**.

A larger grind-size number means a coarser grind. Its negative coefficient therefore means that, within this fitted model, coarser grinding is associated with lower extraction yield.

## 4 | Verify with software

R:

```r
fit <- lm(
  extraction_yield ~ grind_size + water_temp + shot_time,
  data = espresso
)
summary(fit)
```

Python:

```python
X_sm = sm.add_constant(espresso[["grind_size", "water_temp", "shot_time"]])
model = sm.OLS(espresso["extraction_yield"], X_sm).fit()
print(model.summary())
```

The coefficient estimates should agree apart from numerical rounding.

## 5 | Significance

The overall F-test is strongly significant for these data, so the predictors jointly explain substantial variation in extraction yield.

At the 5% level, **grind size** and **water temperature** are significant. **Shot time** is not significant after the other two predictors are included.

That does not mean shot time can never matter. It means this small dataset does not provide strong evidence for an independent shot-time coefficient in this particular model.

## 6 | Multicollinearity and VIF

The lab uses `car::vif()`.

VIF asks whether one predictor is strongly explained by the other predictors. Here the VIF values are close to 1, so multicollinearity is not a concern.

That matters because the non-significant shot-time result cannot reasonably be blamed on strong predictor overlap.

## 7 | What to say without a computer

Erik should be able to explain these points in ordinary language:

- A design matrix is the numerical structure of the regression model.
- The intercept column is represented by ones.
- Multiple regression estimates one predictor's coefficient while controlling for the others included in the model.
- The overall F-test and individual t-tests answer different questions.
- VIF checks whether correlated predictors are making separate coefficients difficult to estimate.
- A p-value is evidence conditional on the model and assumptions; it is not a measure of practical importance.

## 8 | Cloud workflow

There is no need for a machine-specific file path.

R can read:

```r
espresso <- readr::read_csv(
  "https://erikdownes.github.io/resources/ms4215/data/espresso.csv"
)
```

Python can read:

```python
espresso = pd.read_csv(
    "https://erikdownes.github.io/resources/ms4215/data/espresso.csv"
)
```

That means the same data can be used in **Posit Cloud for R** and **Google Colab for Python**.

## Try it

Use the [Colab notebook](https://colab.research.google.com/github/ronandownes/coop/blob/main/resources/ms4215/notebooks/MS4215_Lab2_Espresso_R_to_Python.ipynb) to run the full Python version with explanations, diagnostics and the R equivalents beside it.
