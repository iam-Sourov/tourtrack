# TourTrack Server

This is the backend server for the TourTrack AI Travel Planner. It is built with **Node.js** and **Express**, and it orchestrates the AI itinerary generation by interfacing with a Python script and a local Ollama instance.

## 🚀 Features

-   **API Endpoint**: Exposes a REST API to generate travel itineraries.
-   **AI Integration**: Spawns a Python child process to communicate with a local LLM (via Ollama).
-   **MongoDB Support**: Connects to a MongoDB database (optional for basic AI features).
-   **Environment Configuration**: Uses `dotenv` for secure configuration.

## 🛠️ Prerequisites

-   **Node.js**: v18 or higher.
-   **Python**: v3.8 or higher (with `requests` library installed).
-   **MongoDB**: Community Server (optional but recommended).
-   **Ollama**: Installed and running locally.

## 📦 Installation

1.  Navigate to the server directory:
    ```bash
    cd server
    ```

2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

3.  Install Python dependencies (for the AI service):
    ```bash
    cd ../ai_service
    pip install -r requirements.txt
    ```

## ⚙️ Configuration

A `.env` file should be present in this directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tourTrack
```

## 🏃‍♂️ Running the Server

### Development Mode
To start the server independently:
```bash
node index.js
```
The server will start on `http://localhost:5000`.

### API Endpoints

#### `POST /api/itinerary`

Generates a 3-day travel itinerary based on user input.

**Request Body:**
```json
{
  "vibes": "Rainy Season Adventure",
  "freeTime": "July"
}
```

**Response (Success):**
```json
{
  "destination": "Sylhet",
  "weather_summary": "Monsoon rains, lush greenery",
  "itinerary": [
    { "day": 1, "plan": "..." },
    { "day": 2, "plan": "..." },
    { "day": 3, "plan": "..." }
  ],
  "packing_list": ["Umbrella", "Raincoat"],
  "vibe_match_score": 95
}
```

## ⚠️ Troubleshooting

-   **MongoDB Connection Error**: If you see a warning about MongoDB, the server will still function for AI generation. Ensure `mongod` is running if you need database features.
-   **Python Error**: Ensure `python` is added to your system's PATH.
