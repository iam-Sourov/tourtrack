# TourTrack Client

This is the frontend client for the TourTrack AI Travel Planner. It is a modern, responsive single-page application built with **React**, **Vite**, and **Tailwind CSS**.

## 🎨 Features

-   **Dynamic UI**: An interactive dashboard to input travel vibes and trip dates.
-   **Animations**: Stunning micro-interactions and transitions using **Framer Motion**.
-   **Contextual Visuals**: Dynamic icons and color schemes based on the generated itinerary.
-   **Robust Error Handling**: Gracefully handles backend errors and loading states.

## 🛠️ Tech Stack

-   **React 19**: Modern UI library.
-   **Tailwind CSS 3**: Utility-first CSS framework for rapid styling.
-   **Framer Motion**: Production-ready animation library.
-   **Lucide React**: Custom icon library.
-   **Axios**: Promise-based HTTP client for the browser.

## 📦 Installation

1.  Navigate to the client directory:
    ```bash
    cd client
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## ⚙️ Configuration

The client connects to `http://localhost:5000` by default. If you change the server port, update the API endpoint in `src/App.jsx`.

## 🏃‍♂️ Running the Client

### Development Server

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

To create a production-ready build:

```bash
npm run build
```

This will output optimized files to the `dist/` directory.

## 📂 Project Structure

-   `src/App.jsx`: Main application component containing the state and UI logic.
-   `src/index.css`: Global styles and Tailwind directives.
-   `src/main.jsx`: Application entry point.

## ⚠️ Known Issues

-   If the backend is not running, you will see a specific error message on the form submission.
-   Ensure **Ollama** is running locally for the backend to generate responses.
