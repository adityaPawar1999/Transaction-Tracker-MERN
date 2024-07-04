Transactions Management System
This project is a Transactions Management System built using Node.js, Express, MongoDB for the backend, and React for the frontend. The system allows users to fetch, search, and analyze transaction data.

Features
Fetch JSON data from a remote source and initialize the MongoDB database.
List all transactions with search and pagination.
Retrieve statistics for a specific month.
Generate price range statistics for a specific month (Bar Chart).
Generate category statistics for a specific month (Pie Chart).
Combine all statistics into one response.
Interactive frontend to display transactions and statistics.
Prerequisites
Node.js
MongoDB
npm or yarn
Getting Started
Backend
Clone the repository:

bash
Copy code
git clone https://github.com/your-repo/transactions-management-system.git
cd transactions-management-system
Install backend dependencies:

bash
Copy code
npm install
Start MongoDB:

Make sure MongoDB is running on mongodb://127.0.0.1:27017/transactionsDB.

Start the backend server:

bash
Copy code
npm start
The server will run on http://localhost:5000.

Frontend
Navigate to the frontend directory:

bash
Copy code
cd frontend
Install frontend dependencies:

bash
Copy code
npm install
Start the frontend development server:

bash
Copy code
npm start
The frontend will run on http://localhost:3000.

API Endpoints
Initialize Database
Fetch JSON data from a remote source and initialize the MongoDB database.

http
Copy code
GET /initialize
List Transactions
List all transactions with search and pagination.

http
Copy code
GET /transactions
Query Parameters:

page: Page number (default is 1)
perPage: Number of transactions per page (default is 10)
search: Search term (default is '')
month: Month to filter transactions (required)
Get Monthly Statistics
Retrieve statistics for a specific month.

http
Copy code
GET /statistics
Query Parameters:

month: Month to filter transactions (required)
Get Price Range Statistics (Bar Chart)
Generate price range statistics for a specific month.

http
Copy code
GET /bar-chart
Query Parameters:

month: Month to filter transactions (required)
Get Category Statistics (Pie Chart)
Generate category statistics for a specific month.

http
Copy code
GET /pie-chart
Query Parameters:

month: Month to filter transactions (required)
Get Combined Statistics
Combine all statistics into one response.

http
Copy code
GET /combined-statistics
Query Parameters:

month: Month to filter transactions (required)
Frontend Usage
The frontend application allows users to:

Select a month to view transactions and statistics.
Display transactions in a table format.
Show statistics for the selected month.
Display a bar chart for price range statistics.
Display a pie chart for category statistics.
License
This project is licensed under the MIT License.

Author
Aditya Pawar
