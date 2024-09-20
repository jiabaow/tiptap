# Tiptap Extensions

This web application renders the Tiptap editor in both edit and view modes, featuring an extension for multiple choice questions (MCQs) and the capability to ask AI questions.
## Project Overview

Features:
- Toggle Modes: Users can switch between edit mode and view mode.
- MCQ Creation: Users can create and edit multiple choice questions in edit mode.
- MCQ Attempt: Users can attempt MCQs by submitting a choice in view mode.
- Submissions: Users can check their submissions from the backend.
- AI Interaction: Users can ask AI questions in edit mode, receiving responses generated by OpenAI.

## Prerequisites

Before you begin, ensure you have the following requirements:
- Python 3.x
- yarn
- Git

## Backend - Django

1. Navigate to the backend directory:
```cd backend```
2. Create and activate a virtual environment:
```
python -m venv venv
source venv/bin/active
```
3. Apply database migrations:
```
python manage.py makemigrations
python manage.py migrate
```
4. Create a superuser to access the submitted answers:
```python manage.py createsuperuser```
5. Start the server:
```python manage.py runserver```
6. Access the admin interface at http://127.0.0.1:8000/admin

## Frontend - React

1. Navigate to the frontend directory
```cd ../frontend```
2. Install the dependencies with yarn
```yarn install```
3. Set up environment variables:
   - Create a .env file in the root of the frontend directory.
   - Add your OpenAI API key in the .env file:```REACT_APP_OPENAI_API_KEY=your api key```
4. Go to package.json and click on start scripts to start the server.
5. Access the application at http://localhost:3000

### Notes
- Ensure your backend server is running before accessing the frontend, as the frontend will interact with the backend to store and retrieve submissions.
- The environment variable REACT_APP_OPENAI_API_KEY must be set with a valid OpenAI API key for the AI functionality to work.
