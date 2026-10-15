# 🎓 Campus Placement Prediction System Using Machine Learning

### Predict Placement Readiness Through Student Data Analysis

A machine learning web application that analyzes academic performance and placement-related factors to estimate whether a student is likely to be placed. The system presents prediction results, a confidence score, and suggestions to help students identify areas for improvement.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Objectives](#-objectives)
- [Key Features](#-key-features)
- [Technologies Used](#-technologies-used)
- [Machine Learning Approach](#-machine-learning-approach)
- [System Workflow](#-system-workflow)
- [Model Evaluation](#-model-evaluation)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Future Enhancements](#-future-enhancements)
- [Disclaimer](#-disclaimer)

---

## 🔍 Overview

Campus placement is an important milestone for students. Academic performance, practical experience, aptitude, communication skills, and placement preparation can all contribute to employment outcomes.

This project applies supervised machine learning to historical student data to identify patterns associated with placement outcomes. Users can enter student information through a web interface and receive a predicted placement category with supporting feedback.

**Prediction classes:** `Placed` and `Not Placed`

## ❗ Problem Statement

Students may find it difficult to assess their placement readiness and identify areas that need improvement. This project provides a data-driven estimate using academic and placement-related features, helping students understand potential strengths and weaknesses before campus recruitment.

## 🎯 Objectives

- Develop a machine learning model for student placement classification.
- Analyze academic, practical, aptitude, and soft-skill features.
- Build an interactive web application for obtaining predictions.
- Evaluate model performance using appropriate classification metrics.
- Provide understandable feedback to support placement preparation.

## ✨ Key Features

- **Placement Prediction:** Estimates whether a student is likely to be placed.
- **Multiple Input Features:** Considers CGPA, internships, projects, aptitude scores, soft skills, certifications, and academic marks.
- **Prediction Confidence:** Displays the model's estimated confidence for an individual prediction.
- **Improvement Suggestions:** Highlights areas where a student may strengthen placement readiness.
- **Exploratory Data Analysis:** Includes charts for placement distribution, feature distributions, and numerical correlations.
- **Model Evaluation:** Uses validation metrics and a confusion matrix to examine classification performance.
- **Web Interface:** Provides an accessible interface connected to a Python backend.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Interactive frontend |
| HTML, CSS, JavaScript | Web structure, styling, and interactions |
| Python | Machine learning and backend logic |
| Flask | Backend API |
| Pandas | Dataset processing and analysis |
| Scikit-learn | Preprocessing, model training, and evaluation |
| Matplotlib and Seaborn | Data visualization |
| Joblib | Saving and loading the trained model |

## 🤖 Machine Learning Approach

### Algorithm: Gradient Boosting Classifier

The project uses the Gradient Boosting Classifier as its placement prediction model.

Gradient Boosting is an ensemble learning algorithm that builds decision trees sequentially. Each new tree attempts to reduce the errors made by the existing ensemble.

**Why this algorithm?**

- Suitable for binary classification tasks.
- Can learn nonlinear relationships between student features and placement outcomes.
- Combines multiple decision trees into an ensemble.
- Supports evaluation using accuracy, precision, recall, and a confusion matrix.

### Input Features

- CGPA
- Number of internships
- Number of projects
- Workshops and certifications
- Aptitude test score
- Soft skills rating
- Extracurricular activities
- Placement training
- SSC marks
- HSC marks

### Data Preprocessing

The training pipeline handles missing values and transforms categorical features into a numerical representation where required. The same fitted preprocessing pipeline is applied to new student inputs before prediction.

## 🔄 System Workflow

1. Load historical student placement data.
2. Explore and analyze the dataset.
3. Preprocess the features.
4. Train the machine learning model.
5. Evaluate the model on validation data.
6. Save the trained model for reuse.
7. Receive student details through the React interface.
8. Process the prediction request using Flask.
9. Return the predicted placement class and related feedback.
10. Display the result to the user.

## 📊 Model Evaluation

The recorded validation accuracy is **80.08%**.

Accuracy alone does not describe every aspect of a classifier. Precision, recall, and the confusion matrix are also useful for understanding how well the model identifies each placement category.

The reported accuracy refers to the validation dataset and should not be interpreted as a guarantee of real-world placement success.

## 📁 Project Structure

```text
Campus-Placement-Prediction-System/
├── backend/
│   ├── app.py
│   └── artifacts/
├── frontend/
│   ├── src/
│   └── package.json
├── dataset/
├── eda.py
├── eda_graphs/
└── README.md
```

*The structure above is illustrative. Adjust filenames and folders to match the actual repository.*

## 🚀 Installation and Setup

### Prerequisites

- Python installed
- Node.js and npm installed
- Git installed

### 1. Clone the repository

```bash
git clone https://github.com/sakshichandivade12/Campus-Placement-Prediction-System.git
cd Campus-Placement-Prediction-System
```

### 2. Set up the Python backend

Create and activate a virtual environment, then install the dependencies listed in your backend requirements file.

On Windows PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

If your repository contains `backend/requirements.txt`, install dependencies with:

```powershell
pip install -r backend/requirements.txt
```

Start the backend using the actual entry-point filename and command in your project.

### 3. Set up the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

*Note: Verify the backend requirements filename, backend startup command, and API configuration against your actual files before following these instructions.*

## 🔮 Future Enhancements

- Compare multiple machine learning algorithms.
- Add feature-importance visualizations.
- Improve explanations for individual predictions.
- Add more diverse and representative student data.
- Evaluate performance on an independent test dataset.
- Improve accessibility and mobile responsiveness.

## ⚠️ Disclaimer

This application provides an estimate based on historical data. It does not guarantee placement or determine a student's actual employability. Real placement outcomes also depend on interviews, employer requirements, available vacancies, and other factors.

---

## 👩‍💻 Author

**Sakshi Chandivade**

Campus Placement Prediction System — Machine Learning Project
