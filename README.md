# Hospital Complaint Handling System

A full-stack web application for submitting hospital complaints, generating automatic replies using NLP similarity search, and allowing a doctor to manage and resolve complaints through a dashboard.

## Tech Stack

### Backend
- Python
- FastAPI
- SQLite
- Pandas
- Scikit-learn
- Sentence Transformers (`all-MiniLM-L6-v2`)

### Frontend
- React
- Vite
- Axios
- React Router
- Chart.js

## Features

### Patient Side
- Submit a hospital complaint
- Get an automatic reply based on the most similar complaint in the dataset
- View the 2 most recent complaints on the Patient Portal
- View the full complaint history on the Complaint List page

### Doctor Side
- Single-doctor login flow
- Protected Doctor Dashboard route
- View complaint statistics
- View complaint categories chart
- View pending and resolved counts
- Send manual replies
- Mark complaints as resolved
- Logout support

## Doctor Credentials

- Username: `Dr. Venugopal`
- Password: `asdfghjkl`

## Project Structure

```text
backend/
  app/
    api/
    data/
    database/
    models/
    services/
    utils/
    main.py
  requirements.txt

frontend/
  src/
    components/
    pages/
    services/
    App.jsx
  package.json
```

## NLP Workflow

The backend uses the `all-MiniLM-L6-v2` Sentence Transformers model:

1. Load complaints from `backend/app/data/hospital_complaints_1500.csv`
2. Convert dataset complaint texts into embeddings
3. Convert the user complaint into an embedding
4. Compute cosine similarity
5. Return the most similar complaint's `auto_reply`

## API Endpoints

- `POST /submit-complaint`
  - Input: `complaint_text`
  - Output: automatic reply, category, department, status

- `GET /doctor/complaints`
  - Returns all stored complaints

- `POST /doctor/reply`
  - Input: `complaint_id`, `doctor_reply`
  - Updates complaint status to `resolved`

- `GET /dashboard/stats`
  - Returns total complaints
  - Pending complaints
  - Resolved complaints
  - Complaints by category

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/kumarloki199/hospital-complaint-system.git
cd hospital-complaint-system
```

### 2. Backend setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on:

```text
http://127.0.0.1:8000
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://127.0.0.1:5173
```

## Notes

- The backend enables CORS for the Vite frontend running on port `5173`.
- The SQLite database file is created automatically on backend startup.
- Doctor authentication is frontend-only and stored in `localStorage`.
- The Sentence Transformers model is loaded locally by the backend.

## Future Improvements

- Add real backend authentication with hashed passwords
- Add patient-specific complaint ownership
- Add complaint filtering and search
- Add Docker setup
- Add automated tests
