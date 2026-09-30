---
layout: doc
title: "MS4215 — Week 1"
eyebrow: "ADVANCED DATA ANALYSIS · WEEK 1"
intro: "Introduction to the module and a revision of the statistical ideas used throughout the course."
study_mode: true
---

[← MS4215 resources]({{ '/modules/ms4215-advanced-data-analysis.html' | relative_url }}) · [Lecture 1A slides (PDF)]({{ '/resources/ms4215/lectures/Week_01A.pdf' | relative_url }}) · [Lecture 1B slides]({{ '/resources/ms4215/lectures/Week_01B.pdf' | relative_url }}) · [Irish weather data]({{ '/resources/ms4215/data/ireland_weather_2000_2023.csv' | relative_url }}) · [Weather Google Sheet](https://docs.google.com/spreadsheets/d/1brO-_bQPuW2agos1WuYbVBC5Waye64-FDtYaj-Z36x4/edit?usp=drivesdk)

These web notes follow **Lectures 1A and 1B** from Associate Professor Sinéad Moylett’s MS4215 slides. They put the ideas into a continuous reading format. Use the original slides for the complete examples, figures and class instructions.

## The course and the analysis workflow

MS4215 develops the ability to fit statistical models, interpret their output and judge whether their conclusions are credible. The term moves from **multiple linear regression** (Weeks 1–6) through **ANOVA and extensions** (Weeks 7–8) to **generalised linear models** (Weeks 9–11), followed by revision in Week 12. These are related methods: categorical predictors can be used in regression, and GLMs adapt the model to outcomes such as binary responses or counts.

A typical analysis goes through **import → tidy → transform → visualise → model → communicate**. Each step affects the conclusion. A biased sample, an incorrectly coded variable or an unsuitable model can all produce a convincing but wrong result. Before fitting anything, ask what was measured, who or what was sampled, what is missing, and what question the result can actually answer.

Statistical questions have different aims:

| Aim | Example using weather data | Possible approach |
|:--|:--|:--|
| Describe | What is the typical rainfall at one station? | Summaries and plots |
| Infer | Is rainfall different at two stations in the wider population? | Interval estimates and tests |
| Predict | What temperature might be observed tomorrow? | A predictive model |
| Investigate cause | Would an intervention change an outcome? | Study design and causal reasoning |

The module gives particular weight to **inference under uncertainty**. An association in observational data does not by itself establish causation: a third variable, reverse direction or coincidence may explain it.

## Data, R and reproducibility

**R** is the statistical programming language; **RStudio** is the environment used to edit scripts and inspect output. The Week 1 slides recommend installing R first, then RStudio. A script gives you a permanent, repeatable record of an analysis; commands typed only into the console are easy to lose.

The first building blocks are numeric, character and logical vectors, data frames with rows as observations and columns as variables, and indexing by position or column name. For tidy data, each variable has its own column, each observation its own row, and each cell one value. Avoid storing data through cell colour, merged spreadsheet cells or inconsistent category names.

The running dataset is [Irish weather observations from 2000–2023]({{ '/resources/ms4215/data/ireland_weather_2000_2023.csv' | relative_url }}). Its columns are station, date, maximum temperature (`tmax_c`), minimum temperature (`tmin_c`) and precipitation (`prcp_mm`). The slides show 42,190 rows, and some measurements are missing. When you open a new dataset, inspect its column types, first rows, dimensions, ranges, names and missing values **before** analysis. In R the commands shown include `str()`, `head()`, `dim()` and `summary()`.

For a quick question, the slides compare daily rainfall between stations with a boxplot. That plot can show differences in distribution, but it is still observational evidence. Also note that a blank measurement (`NA`) differs from a recorded rainfall of zero.

## Variable types and trustworthy measurement

The type of variable governs sensible arithmetic, summaries, plots and models. There are two useful classifications: **measurement scale** and **whether numerical values are discrete or continuous**.

| Scale | Meaning | Weather example | Appropriate description |
|:--|:--|:--|:--|
| Nominal | Categories without an order | Station name | Counts and percentages |
| Ordinal | Ordered categories with no assured equal spacing | An ordered rating | Frequencies and sometimes the median |
| Interval | Equal differences, but no meaningful zero | Temperature in °C; calendar date | Differences, mean and spread; ratios of values are not meaningful |
| Ratio | Equal differences and a meaningful zero | Rainfall in mm | Differences, ratios, mean and spread |

A **discrete** variable takes countable values, such as number of rainy days. A **continuous** variable can vary across a range, such as rainfall amount or temperature. Temperature in °C is continuous **and** on an interval scale: 20°C is not twice 10°C. This distinction matters when choosing a plot or model.

**Validity** asks whether the measurement captures what it is meant to measure. **Reliability** asks whether repeated measurement is consistent. A scale that always reads 2 kg too high may be reliable but invalid. A statistical model cannot repair an unsuitable or biased measurement simply by being more complex.

## Describe first: shape, centre and spread

For numerical data, begin with a plot and ask: **What is the shape? Where is the centre? How variable is it?** For categorical data, use counts and percentages. For a roughly symmetric distribution, the mean and standard deviation (SD) are often useful. For a skewed distribution or one with influential extremes, the median and interquartile range (IQR) usually describe a typical observation more faithfully.

| Statistic | What it describes | Main caution |
|:--|:--|:--|
| Mean | Arithmetic average | Sensitive to extreme values |
| Median | Middle ordered value | Gives less information about magnitude in the tails |
| SD | Spread around the mean, in the original units | Sensitive to extreme values |
| IQR | Q3 − Q1: width of the middle 50% | Does not describe the full range |

The weather example shows why the choice matters. Maximum temperature has a mean of about **13.72°C** and a median of **13.7°C**, which are close. Daily rainfall has a mean of about **3.58 mm** but a median of **1.2 mm**: many dry or modest days and fewer very wet days pull the mean upwards. These are summaries of the supplied dataset, not universal weather values. Report how many observations are missing, too; ignoring missingness can bias a comparison.

Match the plot to the question: a **bar chart** for category counts, a **histogram** for the shape of one continuous variable, a **boxplot** for centre and spread or group comparisons, and a **scatter plot** for the relationship between two numerical variables. Label the units and ask what each plot is comparing. Equal or similar summary statistics can hide very different patterns in the underlying data.

## From a sample to an inference

A **population parameter** describes the wider group of interest; a **sample statistic** is calculated from observed data and used to estimate it. Larger, well-designed samples tend to give more precise estimates. Size alone cannot remove selection bias.

The **central limit theorem** explains why averages of sufficiently large, appropriately sampled groups often have an approximately normal sampling distribution even when individual values are skewed. The standard error of a sample mean shrinks approximately with `1/√n`. This supports common confidence interval and test procedures, subject to their assumptions and study design.

A **95% confidence interval** is produced by a method that would contain the fixed population parameter in about 95% of repeated samples under the stated assumptions. After observing this particular interval, it either contains that parameter or it does not. For a mean, the usual t interval has the form `sample mean ± t critical value × (sample SD / √n)`.

For a hypothesis test, state the **null hypothesis** and **alternative**, choose a significance level, calculate the test statistic and p-value, then explain the decision in the context of the data. The p-value is the probability, **assuming the null hypothesis and the model assumptions**, of a result at least as extreme as the one observed. A small p-value is evidence against the null; a large p-value does not prove it true. Statistical significance also does not establish a large or useful effect.

The slides illustrate a one-sample t-test (one mean against a target) and a two-sample t-test (means of two groups). Read the estimate and confidence interval as well as the p-value. A result about differences between weather stations remains an association unless a design justifies a causal claim.

## Check your understanding

1. Why is `station` nominal while temperature in °C is interval and rainfall in mm is ratio scale?
2. Why might median and IQR describe a typical rainy day better than mean and SD?
3. What does a 95% confidence interval mean in repeated sampling?
4. If a t-test has `p = 0.97`, what can you conclude, and what can you **not** conclude?
5. What could go wrong between collecting a dataset and communicating a conclusion?

Return to the [MS4215 resource index]({{ '/modules/ms4215-advanced-data-analysis.html' | relative_url }}) for the lecture PDFs, later weeks and lab datasets. The original slides remain authoritative for module requirements and exact classroom examples.
