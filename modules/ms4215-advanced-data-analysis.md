---
layout: doc
title: "MS4215 — Advanced Data Analysis"
code: "MS4215"
year: "3rd"
semester: "Sem1"
status: "Core"
eyebrow: "3RD YEAR · SEM1"
study_mode: true
---

[← Education]({{ '/education.html' | relative_url }})

## Start here

**[Read Week 1 as a web page →]({{ '/education/ms4215/week-01.html' | relative_url }})**  
Introduction, the R environment, variable types, descriptive statistics, plots, sampling, confidence intervals and hypothesis tests.

**[Read Week 2 as a web page →]({{ '/education/ms4215/week-02.html' | relative_url }})**  
Correlation, simple linear regression and the move to multiple linear regression.

**[Work through Lab 2: Espresso Extraction →]({{ '/education/ms4215/lab-02.html' | relative_url }})**  
Design matrices, the OLS matrix formula, R's `lm()`, the equivalent Python analysis, significance tests and VIF. [Open the full Python notebook in Colab](https://colab.research.google.com/github/ronandownes/coop/blob/main/resources/ms4215/notebooks/MS4215_Lab2_Espresso_R_to_Python.ipynb).

This module develops practical and theoretical skill in **building, interpreting and critically evaluating statistical models**. It connects multiple regression, analysis of variance (ANOVA) and generalised linear models (GLMs). The emphasis is on interpreting results and checking whether a model answers the question reliably.

## Course map

| Stage | Focus | Material in this archive |
|:--|:--|:--|
| Weeks 1–6 | Multiple linear regression, diagnostics and model selection | Slides for Weeks 1–3 |
| Weeks 7–8 | ANOVA and extensions | Lab sheets in the archive |
| Weeks 9–11 | GLMs for binary and count outcomes | Lab sheets in the archive |
| Week 12 | Revision | — |

The Brightspace overview lists an **online test in Week 6 (10%)**, a **data analysis assignment due at the end of Week 12 (20%)**, and a **final exam in Weeks 14/15 (70%)**. Confirm dates and instructions in Brightspace, especially if they change. Labs begin in **Week 3**, so the numbered lab sheets below are separate from Week 1.

## Lecture resources

The original CSVs remain available for R and Python. The Google Sheets copies open in a browser and require access to the Drive account. [Open the MS4215 dataset folder](https://drive.google.com/drive/folders/1-UGHDAUzy4MjNT8952aPRKIGJN2Ar7O5).

| Week | Topic | Original slides | Data supplied |
|:--|:--|:--|:--|
| 1A | Module introduction, data analysis and R | [Week 01A PDF]({{ '/resources/ms4215/lectures/Week_01A.pdf' | relative_url }}) | [Irish weather CSV]({{ '/resources/ms4215/data/ireland_weather_2000_2023.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1eAXNKiHzpSyLJsTn5P6pod54v3upiEO7oFywAozh7Yo/edit) |
| 1B | Statistical concepts and inference | [Week 01B PDF]({{ '/resources/ms4215/lectures/Week_01B.pdf' | relative_url }}) | Same weather data |
| 2A | Correlation and simple linear regression | [Week 02A PDF]({{ '/resources/ms4215/lectures/Week_02A.pdf' | relative_url }}) | Slides mention `sales.csv`; it was not in the ZIP |
| 2B | Multiple linear regression | [Week 02B PDF]({{ '/resources/ms4215/lectures/Week_02B.pdf' | relative_url }}) | [Earnings CSV]({{ '/resources/ms4215/data/earnings.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/18bwn4jtUDl1xUnnHB-muQjYEDUtDnqBpJmf-tk05Kfk/edit); slides also mention `beer.csv`, not in the ZIP |
| 3A | Multicollinearity in multiple regression | [Week 03A PDF]({{ '/resources/ms4215/lectures/Week_03A.pdf' | relative_url }}) | [Cars CSV]({{ '/resources/ms4215/data/cars.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1_UuV8z3rysQowGlSdpu9RhfN15GgGq-Bt-EuYbv9MAU/edit?usp=drivesdk) |

**Week 1 is available in HTML above.** Later lecture PDFs are indexed here while their HTML lessons are prepared. The two copies of `cars.csv` in the upload were identical, so the resource folder contains one copy.

## Lab sheets and datasets

| Lab | Questions | Dataset | Other material |
|:--|:--|:--|:--|
| 1 | [Spotify analysis]({{ '/resources/ms4215/labs/lab_1_questions.pdf' | relative_url }}) | [Spotify CSV (ZIP)]({{ '/resources/ms4215/archives/lab1_dataset_spotify.zip' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1BLT0VrndXClexX4k3pRfRFnh-F6mQkIGm_gnzcCm-8Q/edit?usp=drivesdk) | [Supplied solutions]({{ '/resources/ms4215/labs/lab_1_solutions.pdf' | relative_url }}) |
| 2 | [Espresso]({{ '/resources/ms4215/labs/lab_2_questions.pdf' | relative_url }}) | [Espresso CSV]({{ '/resources/ms4215/data/espresso.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1cQJ-lTF_SWdBG3GXXLfz677YAu8RrgY7C8bCbZyO9Zc/edit) | — |
| 3 | [Cardiovascular study]({{ '/resources/ms4215/labs/lab_3_questions.pdf' | relative_url }}) | [Heart study CSV]({{ '/resources/ms4215/data/heart_study.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1ap5bjrWMTSytRfBusUXGI-Ty_I45-MY9iAWYx9SZnoY/edit?usp=drivesdk) | — |
| 4 | [Wages and experience]({{ '/resources/ms4215/labs/lab_4_questions.pdf' | relative_url }}) | `CPS1985` is loaded from an R package in the sheet | — |
| 5 | [Exercise and wellbeing]({{ '/resources/ms4215/labs/lab_5_questions.pdf' | relative_url }}) | [Exercise CSV]({{ '/resources/ms4215/data/exercise_wellbeing.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1tLiPNqgFvRvbf9Wp_LW4c0YBXD2UfAAfpXfeYT9qdNo/edit?usp=drivesdk) | — |
| 6 | [Penguins and ANOVA]({{ '/resources/ms4215/labs/lab_6_questions.pdf' | relative_url }}) | [Penguins CSV]({{ '/resources/ms4215/data/penguins.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1_auXvpV2-8vXdDw8cfLiEdG2RHa9yz8sySyWpM03dvs/edit?usp=drivesdk) | — |
| 7 | [Baseball salaries]({{ '/resources/ms4215/labs/lab_7_questions.pdf' | relative_url }}) | [Hitters CSV]({{ '/resources/ms4215/data/hitters.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/18EXdgZGGk2TWCdXV26p-Q7GX1e58R4tchjdPNtiQRkQ/edit?usp=drivesdk) | — |
| 8 | [Heart disease and logistic regression]({{ '/resources/ms4215/labs/lab_8_questions.pdf' | relative_url }}) | [Heart CSV]({{ '/resources/ms4215/data/heart.csv' | relative_url }}) · [Google Sheet](https://docs.google.com/spreadsheets/d/1URfkw3ynKzv2xd7UW4F8J7NHn5oQt14B_dJKjvRqM8M/edit?usp=drivesdk) | — |
| 9 | [Diabetes and logistic regression]({{ '/resources/ms4215/labs/lab_9_questions.pdf' | relative_url }}) | Pima data are loaded from the R package named in the sheet | — |

The lab numbers are the document labels; the upload does not give a separate calendar date for each lab. Files are grouped by the dataset named in each sheet, rather than by alphabetical filename.

## What to recognise and explain

- **Regression:** how a response changes with predictors, what coefficients mean, and why assumptions and diagnostics matter.
- **ANOVA:** compares groups within the same linear-model framework; categorical predictors can be represented using indicator variables.
- **GLMs:** extend the framework to outcomes such as yes/no results and counts.
- **Critical interpretation:** distinguish association from causation, assess missingness and selection, and explain uncertainty in ordinary language.

For an asset-management interview, a useful connection is **exploring an aircraft dataset, fitting a model of an outcome, checking its assumptions, and communicating what the result can and cannot support**. That is an application of the methods, not a claim that this module used aircraft data.
