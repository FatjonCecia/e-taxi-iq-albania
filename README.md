# E-Taxi IQ Albania

E-Taxi IQ Albania is a full-stack analytics and machine learning platform designed to analyze customer reviews for electric taxi companies in Albania.

The project combines React, FastAPI, MongoDB, and Machine Learning to transform customer reviews into actionable business intelligence.

## Live Demo

**Frontend:** [E-Taxi IQ Albania — Vercel](YOUR_VERCEL_LINK_HERE)

> Replace `YOUR_VERCEL_LINK_HERE` with your actual Vercel deployment URL.

---

## Overview

E-Taxi IQ Albania analyzes customer reviews and provides insights into:

* Customer ratings
* Overall sentiment
* Review aspects
* Suspicious or anomalous review patterns
* Company performance
* City distribution
* Review trends and statistics

The application includes an interactive dashboard where users can explore review data and submit new reviews for automatic machine learning analysis.

---

## Features

### Analytics Dashboard

The dashboard provides an overview of the review dataset, including:

* Total number of reviews
* Average rating
* Sentiment distribution
* Company distribution
* City distribution
* Anomaly statistics
* Aspect analysis
* Rating distribution

Interactive charts make it easier to identify trends and compare companies.

### Review Management

Users can:

* View historical reviews
* Filter reviews
* Browse reviews through pagination
* Submit new reviews
* Receive automatic predictions from the machine learning models

### Machine Learning

The system uses three separate machine learning models.

#### Sentiment Analysis

Classifies reviews into:

* Positive
* Neutral
* Negative

**Test Accuracy:** approximately 91%

**Macro F1:** approximately 87%

#### Aspect Classification

Identifies the primary topic discussed in a review.

Supported aspects include:

* Vehicle Quality
* Airport Transfer
* Driving Quality
* Charging
* Comfort
* Safety
* Price
* Cleanliness
* Waiting Time
* Driver Behavior
* Communication
* Punctuality

**Test Accuracy:** approximately 77%

**Macro F1:** approximately 77%

#### Anomaly Detection

Detects potentially unusual review behavior using features such as:

* Reviews posted on the same day
* Company reviews posted on the same day
* Rating frequency
* Rating
* Review text length

**Test Accuracy:** approximately 94%

**Balanced Accuracy:** approximately 80%

---

## Architecture

```text
                    +----------------------+
                    |      React/Vite      |
                    |      Frontend        |
                    +----------+-----------+
                               |
                               | HTTP / REST API
                               v
                    +----------------------+
                    |       FastAPI        |
                    |       Backend        |
                    +----------+-----------+
                               |
              +----------------+----------------+
              |                |                |
              v                v                v
       +------------+   +------------+   +------------+
       | Sentiment  |   |   Aspect   |   |  Anomaly   |
       |   Model    |   |   Model    |   |   Model    |
       +------------+   +------------+   +------------+
                               |
                               v
                    +----------------------+
                    |    MongoDB Atlas     |
                    |      Database        |
                    +----------------------+
```

---

## Technology Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Bootstrap
* Chart.js
* React Chart.js 2

### Backend

* Python
* FastAPI
* Pydantic
* PyMongo
* Uvicorn

### Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* TF-IDF
* Classification models
* Joblib

### Database

* MongoDB
* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## Project Structure

```text
e-taxi-iq-albania/
│
├── backend/
│   └── app/
│       ├── main.py
│       ├── database.py
│       ├── schemas.py
│       ├── import_reviews.py
│       └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── ml/
│   ├── data/
│   │   └── raw/
│   │       └── reviews.csv
│   │
│   ├── models/
│   │   ├── sentiment_model.pkl
│   │   ├── aspect_model.pkl
│   │   └── anomaly_model.pkl
│   │
│   └── ...
│
├── .gitignore
└── README.md
```

---

## Dataset

The project uses a customer review dataset containing information such as:

```text
review_id
company_id
company_name
city
rating
review_date
review_text
overall_sentiment
primary_aspect
aspect_labels
mentioned_driver
is_anomaly
anomaly_reason
source_type
text_length
year_month
```

The dataset contains more than 2,100 customer reviews across multiple electric taxi companies and cities in Albania.

---

## How the System Works

### 1. Customer submits a review

A user submits a review through the React frontend.

```text
React
  |
  v
POST /reviews
```

### 2. FastAPI receives the review

The backend validates the request using Pydantic.

### 3. Machine Learning predictions

The review is processed by the machine learning models.

```text
Review
  |
  +----> Sentiment Model
  |
  +----> Aspect Model
  |
  +----> Anomaly Model
```

### 4. Results are stored

The review and its predictions are stored in MongoDB.

### 5. Frontend displays the results

The React application retrieves the data from the API and displays the results through cards, tables, filters, and charts.

---

## API Endpoints

### Health Check

```http
GET /health
```

Checks whether the backend is running.

### Get Reviews

```http
GET /reviews
```

Returns stored reviews.

### Create Review

```http
POST /reviews
```

Submits a new review and generates machine learning predictions.

### Analytics

```http
GET /analytics
```

Returns aggregated analytics used by the dashboard.

---

## Running Locally

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/e-taxi-iq-albania.git

cd e-taxi-iq-albania
```

### Backend Setup

```bash
cd backend

python -m venv .venv
```

Activate the virtual environment on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Environment Variables

The backend uses environment variables for sensitive configuration.

Example:

```env
MONGODB_URL=your_mongodb_connection_string
```

Do not commit `.env` files, database credentials, or other secrets to the repository.

---

## Deployment

The production architecture uses Vercel for the frontend, Render for the backend, and MongoDB Atlas for the database.

```text
                    Vercel
                      |
                      v
               React Frontend
                      |
                      | API Requests
                      v
                   Render
                      |
                      v
                FastAPI Backend
                      |
                      v
                MongoDB Atlas
```

---

## Model Performance

| Model     | Test Accuracy | Macro F1 | Balanced Accuracy |
| --------- | ------------: | -------: | ----------------: |
| Sentiment |          ~91% |     ~87% |                 - |
| Aspect    |          ~77% |     ~77% |                 - |
| Anomaly   |          ~94% |     ~79% |              ~80% |

---

## Project Goals

The main goal of E-Taxi IQ Albania is to demonstrate how machine learning can be integrated into a real-world full-stack application.

Rather than keeping the machine learning models isolated in notebooks, the project connects the complete pipeline:

```text
Raw Data
   |
   v
Data Cleaning
   |
   v
Feature Engineering
   |
   v
Model Training
   |
   v
Model Evaluation
   |
   v
Model Serialization
   |
   v
FastAPI Integration
   |
   v
MongoDB
   |
   v
React Dashboard
   |
   v
Production Deployment
```

---

## What This Project Demonstrates

This project demonstrates practical experience with:

* Full-stack application development
* React development
* REST API development
* FastAPI
* MongoDB and MongoDB Atlas
* Machine learning
* Natural language processing
* Text classification
* Sentiment analysis
* Aspect classification
* Anomaly detection
* Feature engineering
* Model evaluation
* Data visualization
* API integration
* Cloud deployment
* Environment variables
* Frontend and backend architecture

---

## Future Improvements

Potential future improvements include:

* Real-time review monitoring
* More advanced NLP models
* Albanian-language sentiment analysis
* Company performance scoring
* Review trend forecasting
* Automated business recommendations
* Authentication and user accounts
* Advanced anomaly explanations
* More detailed geographic analytics
* Automated model retraining

---

## Author

Built as a full-stack machine learning project focused on applying data science and modern web technologies to a real-world business problem in Albania.

## Live Project

**Vercel:** [E-Taxi IQ Albania](https://e-taxi-iq-albania.vercel.app/)

**GitHub:** [e-taxi-iq-albania](https://github.com/FatjonCecia/)
