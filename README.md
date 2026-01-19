# H4G Signup Manager (2026)

This repository contains the signup management application for H4G 2026. It is a modern web application built with React and Vite, utilizing Supabase for backend services and Docker for containerized development.

## Deployment

This application is deployed on Vercel. You can view the live version here:

- [**Live Application**](https://h4-g-2026.vercel.app/)

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (Auth, Database, Realtime)
- **Containerization**: Docker
- **Utilities**: date-fns, fast-levenshtein

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- Docker (optional, for containerized execution)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Joshua-Seah/H4G-2026.git
    cd H4G-2026
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Development

You can run the application locally using the standard Vite server or via Docker.

### Standard Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Docker Development

To build and run the application in a container:

```bash
docker compose up --build
```

The application will be available at `http://localhost:5173`.

For more details on building images for deployment or different architectures, please refer to README.Docker.md.

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.

## Project Structure

Here is a brief overview of the key files and directories in this project:

- **`src/`**: Contains the source code for the React application.
  - **`main.jsx`**: The entry point of the application.
  - **`Login.jsx`**: The login page component.
  - **`components/`**: Reusable UI components.
  - **`db/`**: Helper functions and db connection to Supabase
  - **`Form/`**: Contains components and files for the various forms in the webapp
  - **`gsheets/`**: API Client file with helper functions for interacting with Google Sheets
