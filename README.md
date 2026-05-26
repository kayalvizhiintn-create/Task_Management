🚀 Navanala Task - SaaS Employee & Task Management Dashboard

An extremely premium, state-of-the-art React + Vite based Employee & Task Management SaaS Dashboard. Built with visual excellence, responsive layout transitions, global dark/light mode toggle, dynamic local database mock services, and powerful PDF/Excel reporting capabilities.

🛠️ Tech Stack & Architecture
Technology	Why We Use It
React 19	Used for building dynamic, state-driven reusable UI components with hot module reloading support.
Vite	A lightning-fast next-generation frontend build tool that replaces slower traditional bundlers.
TailwindCSS	Utility-first CSS framework used for premium responsive design and custom UI styling.
React Router DOM 7	Handles seamless client-side routing without refreshing the browser.
Lucide React	Provides modern and clean SVG icons for a professional user interface.
jsPDF & AutoTable	Generates downloadable analytical PDF reports with custom tables.
XLSX (SheetJS)	Creates downloadable Excel spreadsheets for task and employee reports.
📂 Project Folder Structure & Purpose
Navanala_task/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TaskManagement.jsx
│   │   ├── CreateTask.jsx
│   │   ├── TaskDetails.jsx
│   │   ├── EmployeeView.jsx
│   │   ├── EmployeeDirectory.jsx
│   │   ├── EmployeeProfileView.jsx
│   │   ├── EmployeeDetails.jsx
│   │   ├── AdminEmployees.jsx
│   │   ├── Categories.jsx
│   │   ├── Reports.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   └── taskService.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
🔍 File-by-File Breakdown
1. package.json

Contains:

Project metadata
NPM scripts
Dependency management
External libraries such as React, TailwindCSS, jsPDF, and XLSX

Purpose:
Used to manage all project packages and execution commands.

2. vite.config.js

Configures the Vite bundler and React plugins.

Purpose:
Optimizes frontend compilation and improves development speed.

3. src/main.jsx

The main React entry point.

Purpose:
Mounts the React application into the browser DOM.

4. src/App.jsx

Contains:

Application routing
Theme initialization
Page navigation logic

Purpose:
Acts as the core controller of the entire application.

5. src/services/taskService.js

Handles:

Task data
Employee data
Categories
LocalStorage operations

Purpose:
Simulates a local database system using browser storage.

6. src/layouts/DashboardLayout.jsx

Provides:

Sidebar
Navbar
Dynamic content rendering using <Outlet />

Purpose:
Creates a reusable dashboard layout for all pages.

7. src/pages/Login.jsx

Handles:

User authentication
Admin/member login validation

Purpose:
Acts as the login gateway for the dashboard.

8. src/pages/Dashboard.jsx

Displays:

Task statistics
Progress charts
Employee workload summaries

Purpose:
Main analytics overview page.

9. src/pages/TaskManagement.jsx

Features:

Task search
Filters
Status management
Task actions

Purpose:
Used to manage all tasks efficiently.

10. src/pages/CreateTask.jsx

Allows users to:

Create tasks
Assign employees
Set priorities
Add deadlines

Purpose:
Task creation form page.

11. src/pages/TaskDetails.jsx

Displays:

Task history
Timeline
Remarks
Status updates

Purpose:
Detailed task monitoring page.

12. src/pages/EmployeeView.jsx

Displays:

Employee workloads
Performance metrics
Pending tasks

Purpose:
Used for employee performance tracking.

13. src/pages/EmployeeDirectory.jsx

Displays:

Employee cards
Contact information
Role-based filtering

Purpose:
Company employee directory page.

14. src/pages/EmployeeProfileView.jsx

Shows:

Full employee profile
Assigned work details
Profile overview

Purpose:
Detailed individual employee profile page.

15. src/pages/EmployeeDetails.jsx

Allows users to edit:

Name
Bio
Mobile number
Profile information

Purpose:
Self-profile customization page.

16. src/pages/AdminEmployees.jsx

Admin-only features:

Add employees
Edit employee profiles
Manage roles

Purpose:
Administrative employee management panel.

17. src/pages/Categories.jsx

Displays:

Department-wise analytics
Task completion percentages
Progress charts

Purpose:
Department category analytics dashboard.

18. src/pages/Reports.jsx

Exports:

PDF reports
Excel sheets
Filtered task reports

Purpose:
Report generation and download page.

19. src/pages/Settings.jsx

Controls:

Dark/Light mode
Local database reset
Notification settings

Purpose:
Application configuration and customization page.

🔑 Login Credentials
Admin Login
Email: kayal@gmail.com
Password: 12345678
Admin Privileges
Add employees
Download reports
Delete tasks
Manage dashboard settings
Employee Login
Use any valid email format
Any password is accepted

Example:

emma@company.com
newuser@gmail.com
Employee Features
Automatically creates a new employee profile
Generates a random avatar
Access personal dashboard features
🏃‍♂️ Step-by-Step Execution Guide
Step 1: Install Node.js

Check installation:

node -v
Step 2: Navigate to Project Folder
cd d:\Navanala_task
Step 3: Install Dependencies
npm install

This installs:

React
TailwindCSS
React Router
jsPDF
XLSX
Other required packages
Step 4: Start Development Server
npm run dev

Default URL:

http://localhost:5173/

or

http://localhost:5173/#/login
Step 5: Build for Production
npm run build

Creates an optimized dist folder ready for deployment.

✨ Premium UI Features
1. Modern HSL Theme Engine
Dark/light mode
Glassmorphism UI
Premium shadows and gradients
2. Dynamic Dashboard Cards
Real-time task summaries
Employee workload visualization
3. LocalStorage Synchronization
Persistent task management
Instant UI updates
Activity tracking
4. PDF & Excel Reporting
Download reports instantly
Custom date filters
Exportable analytics
