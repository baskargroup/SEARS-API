# SEARS API

This application provides the frontend and backend for SEARS. It has the following components:

- User/Admin authentication (signup/login)
  ![User/Admin authentication](screenshots/S.png)
- Admin dashboard for user management. Approve/Deactivate users
  ![Admin dashboard](screenshots/A.png)
- User Dashboard for API key management, schema view, test queries
  ![User Dashboard](screenshots/D1.png)
  ![User Dashboard](screenshots/D2.png)


## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sears-api.git
   cd sears-api/backend (for frontend, use cd sears-api/frontend)
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration.

5. Start the development server:
   ```bash
   npm run dev
   ```

Please Note:
```
You have to do it twice. once for the frontend and once for the backend.
```

