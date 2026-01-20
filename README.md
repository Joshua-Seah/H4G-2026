# H4G Signup Manager (2026)

This repository contains the signup management application for H4G 2026. It is a modern web application built with React and Vite, utilizing Supabase for backend services.

## Deployment

This application is deployed on Vercel. You can view the live version here:

- [**Live Application**](https://h4-g-2026.vercel.app/)

This application also has a Google Sheet summary for staff to reference. You can view it here:

- [**Google Sheet Summary**](https://docs.google.com/spreadsheets/d/1lGKgPlAspOdIC8IL9SIrYBMFcvmS5TjZoWAcqq0e95E/edit?usp=sharing)

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Supabase (Auth, Database)

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

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

You can run the application locally using the standard Vite server.

### Standard Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Project Structure

Here is a brief overview of the key files and directories in this project:

- **`src/`**: Contains the source code for the React application.
  - **`main.jsx`**: The entry point of the application.
  - **`Login.jsx`**: The login page component.
  - **`components/`**: Reusable UI components.
  - **`db/`**: Helper functions and db connection to Supabase
  - **`Form/`**: Contains components and files for the various forms in the webapp
  - **`gsheets/`**: API Client file with helper functions for interacting with Google Sheets
 
## Database

Here is a brief summary of our Schema and constraints

### Schema

![Schema](https://github.com/user-attachments/assets/b7df73f6-1f0a-4a82-b02f-e1b6dded040c)

* We have 3 main tables:
  * Events
  * Users
  * Forms
    * Stores the details of an event sign up for any user
* We have some constraints:
  * Preventing bad data such as signing up past deadlines, invalid date ranges, signing up for overlapping events, and max participation enforcement

## Miscellaneous

The background image for the calendar can be changed however you like through uploading it in the Staff form.

However, we recommend you work off of a template so that the boxes line up with the calendar tiles:

- [**Template**](https://www.canva.com/design/DAG-1SlM3Wc/ZifjfPRuvEAOksxW6eRJvw/view?utm_content=DAG-1SlM3Wc&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=ha230cdc259)
