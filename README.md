# Gig Verification Portal 🛡️

A secure, real-time verification and risk-scoring platform for gig workers (delivery, ride-sharing, services). Enables police and authorized agencies to verify worker identities, check criminal history, and assess risk scores instantly.

![Gig Verify Banner](https://via.placeholder.com/1200x400?text=Gig+Verification+Platform)

## 🚀 Features

-   **Instant Verification**: Search by Phone, Name, or Gov ID.
-   **Risk Scoring API**: Automated Low/Medium/High risk assessment based on incident history.
-   **Live Features**: Interactive Map (Last Active Location) and Face Verification simulation.
-   **Cross-Platform Badges**: See if a worker is linked to other platforms (Uber, Zomato, etc.).
-   **Security**: Role-based access (Police/Admin) and immutable Audit Logs.

## 🛠️ Tech Stack

-   **Frontend**: React, Vite, Framer Motion, Tailwind (concepts), Lucide React.
-   **Backend**: Node.js, Express.
-   **Database**: SQLite (with Prisma ORM).
-   **Tools**: Leaflet (Maps), HTML2Canvas (PDF Reports).

## 🏃‍♂️ Run Locally

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/dipayansardar73-decode/gig-verification-portal.git
    cd gig-verification-portal
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    cd client && npm install
    cd ../server && npm install
    ```

3.  **Setup Database**
    ```bash
    cd server
    npx prisma migrate dev --name init
    node prisma/seed_real.js  # Seeds realistic indian demo data
    ```

4.  **Start the App**
    Go back to the root directory and run:
    ```bash
    npm start
    ```
    -   Frontend: `http://localhost:5173`
    -   Backend: `http://localhost:3000`

## 🔑 Demo Credentials

**Police Officer Access:**
-   **Email**: `police@gov.in`
-   **Password**: `password123`

**Admin Access:**
-   **Email**: `admin@zomato.com`
-   **Password**: `password123`

**Demo Search Numbers:**
-   `9876500001` (Amit Patel - Low Risk, Safe)
-   `9876500012` (Deepak Chopra - High Risk, Fraud)

## 🌐 Deployment

This project uses a monorepo structure.

**Frontend (Vercel/Netlify):**
-   Root Directory: `client`
-   Build Command: `npm run build`
-   Output Directory: `dist`

**Backend (Render/Railway):**
-   Root Directory: `server`
-   Build Command: `npm install`
-   Start Command: `node src/index.js`

---

Built for **Smart India Hackathon** / **Safety Tech Challenge** 2025.
