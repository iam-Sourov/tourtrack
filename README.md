# AI Travel Planner for Bangladesh

A local-first, AI-powered travel dashboard for Sylhet and Sitakunda. It uses Ollama to generate personalized itineraries based on your "vibe" and free time, cross-referenced with simulated local weather data.

## Project Structure

- **client/**: React frontend with Tailwind CSS and Framer Motion.
- **server/**: Node.js Express backend that orchestrates the AI service.
- **ai_service/**: Python script that interfaces with your local Ollama instance.

## Prerequisites

1.  **Node.js** (v18+)
2.  **Python** (v3.8+)
3.  **Ollama** installed and running locally (Default port: 11434).
    -   Ensure you have a model pulled (e.g., `ollama pull llama3` or `ollama pull mistral`).
4.  **MongoDB** (Optional, for future data persistence).

## Setup & Installation

1.  **Install Dependencies:**
    Run the following command in the root directory:
    ```bash
    npm install
    npm run install:all
    ```
    This installs dependencies for root, client, server, and Python requirements.

2.  **Verify Python Environment:**
    Ensure `requests` is installed in your Python environment:
    ```bash
    pip install requests
    ```

## Running the App

1.  **Start Ollama:**
    Ensure Ollama is running in the background.

2.  **Start the Application:**
    In the root directory, run:
    ```bash
    npm run dev
    ```
    This will start both the backend server (Port 5000) and the frontend client (Port 5173).

3.  **Open in Browser:**
    Navigate to `http://localhost:5173`.

## Usage

1.  Enter your desired **Vibe** (e.g., "Monsoon adventure", "Relaxed tea sipping").
2.  Enter your **Free Time** (e.g., "July", "Next weekend").
3.  Click **Generate Plan**.
4.  View your custom 3-day itinerary, weather forecast, and packing list.

## Troubleshooting

-   **"MongoDB connection failed"**:
    -   Ensure MongoDB Community Server is installed.
    -   Make sure the MongoDB service is running. On Windows, check "Services" app for `MongoDB Server`.
    -   Or manually run `mongod` in a separate terminal.
