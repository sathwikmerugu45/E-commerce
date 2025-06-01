Project Local Setup Guide
Environment Variable
Make sure to set the API URL in your environment file or your terminal before starting the frontend:

VITE_API_URL=http://localhost:5000
Running Locally
Clone the repository:

git clone <your-repo-url>
cd <your-repo-folder>
Install dependencies:

npm install
# or
yarn install

Start the backend server (make sure your backend is running on port 5000):

npm run start
# or the command you use to start backend
Start the frontend server:

npm run dev
# or
yarn dev
Open in browser:

Go to the URL below to see the admin data page:

http://localhost:5173/admin

Notes
Make sure the backend server is running on http://localhost:5000 or update the VITE_API_URL accordingly.

Frontend runs on port 5173 by default with Vite.

Admin page is accessible at /admin.
