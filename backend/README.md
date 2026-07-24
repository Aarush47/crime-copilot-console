# KSP Crime Copilot Backend

FastAPI backend designed for Zoho Catalyst AppSail.

## Setup

1. Create a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   python main.py
   # or
   uvicorn app.main:app --reload
   ```

## API Documentation
Once running, visit `http://localhost:8000/docs` to view the interactive Swagger documentation.

## Deployment
This backend is designed to be deployed to Zoho Catalyst AppSail using the Python 3.12 runtime. Catalyst will execute `python main.py` automatically.
