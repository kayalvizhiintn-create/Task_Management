# 🚀 Navanala Task - SaaS Employee & Task Management Dashboard

An extremely premium, state-of-the-art **React + Vite** based Employee & Task Management SaaS Dashboard. Built with visual excellence, responsive layout transitions, global dark/light mode toggle, dynamic local database mock services, and powerful PDF/Excel reporting capabilities.

---

## 🛠️ Tech Stack & Architecture (தொழில்நுட்ப கட்டமைப்பு)

| Technology | Why we use it (ஏன் இதை பயன்படுத்துகிறோம்?) |
| :--- | :--- |
| **React 19** | Used for building dynamic, state-driven reusable components with hot module reloading. (இடைமுகத்தை எளிதாகவும் வேகமாகவும் மாற்ற பயன்படுகிறது.) |
| **Vite** | Lightning fast next-gen frontend build tool replacing heavy Webpack builds. (அதிவேகமாக code-ஐ compile செய்து browser-ல் காட்ட பயன்படுகிறது.) |
| **TailwindCSS** | Utility-first CSS framework for curated premium aesthetic styling and HSL colors. (அழகான responsive design மற்றும் custom layouts உருவாக்க பயன்படுகிறது.) |
| **React Router DOM 7** | Client-side routing to load page views seamlessly without refreshing the browser. (பக்கங்களை reload செய்யாமல் எளிதாக மாற பயன்படுகிறது.) |
| **Lucide React** | A beautiful, cohesive library of clean modern outline SVG icons. (மென்பொருளுக்கு தேவையான நவீன icons-களை கொடுக்கிறது.) |
| **jsPDF & AutoTable** | Exports analytical reports into well-formatted PDFs with custom tables. (அறிக்கைகளை PDF வடிவில் download செய்ய உதவுகிறது.) |
| **XLSX (SheetJS)** | Generates tabular reports directly into functional Microsoft Excel spreadsheets. (தரவுகளை Excel File ஆக மாற்றி export செய்ய பயன்படுகிறது.) |

---

## 📂 Project Folder Structure & Use (கோப்பு கட்டமைப்பு மற்றும் அதன் பயன்கள்)

```text
Navanala_task/
├── public/                 # Static assets (icon-கள் மற்றும் images)
├── src/                    # Main source code folder
│   ├── assets/             # Images, custom fonts, or styles
│   ├── components/         # Reusable page components (மறுபயன்பாட்டு கூறுகள்)
│   │   ├── Navbar.jsx      # Top navigation with global search, dark-mode, & profile details
│   │   └── Sidebar.jsx     # Side menu for switching routes (dashboard, tasks, reports)
│   ├── layouts/            # Global layouts wrapping nested pages
│   │   └── DashboardLayout.jsx # Layout containing Sidebar + Navbar + Content panel
│   ├── pages/              # Individual Page components (பக்கங்கள்)
│   │   ├── Login.jsx       # Login verification screen
│   │   ├── Dashboard.jsx   # Interactive metrics, chart data & recent workloads
│   │   ├── TaskManagement.jsx # Task search, filter status & grid list
│   │   ├── CreateTask.jsx  # New task addition form with assignees & categories
│   │   ├── TaskDetails.jsx # Detailed task log, edit properties & status changes
│   │   ├── EmployeeView.jsx # Employee listing & workloads for managers
│   │   ├── EmployeeDirectory.jsx # Detailed company contact directory
│   │   ├── EmployeeProfileView.jsx # Detailed individual profile card view
│   │   ├── EmployeeDetails.jsx # Self-profile editing (Name, Bio, Aadhar, Mobile)
│   │   ├── AdminEmployees.jsx # Admin tools to add/edit employee accounts
│   │   ├── Categories.jsx  # Group progress analytics & task volumes
│   │   ├── Reports.jsx     # Download Excel/PDF reports with date limits
│   │   └── Settings.jsx    # Interface customize options & user status toggles
│   ├── services/           # Service modules (சேவைகள்)
│   │   └── taskService.js  # Main Mock database handler saving data in LocalStorage
│   ├── App.css             # Main styling classes
│   ├── App.jsx             # Core router and configuration coordinator
│   ├── index.css           # Custom CSS utility styling & theme declarations
│   └── main.jsx            # React root DOM compiler mount point
├── package.json            # NPM configuration, scripts & package dependencies list
├── vite.config.js          # Vite build config rules
├── tailwind.config.js      # Custom utility styling configuration rules
└── README.md               # Complete application documentation
```

### 🔍 File-by-File Breakdown & Purpose (ஒவ்வொரு கோப்பின் பயன்பாடு)

#### 1. `package.json`
* **English:** Contains project meta-data, build scripts (`npm run dev`), and lists external dependencies (`lucide-react`, `jspdf`, `xlsx`).
* **Tamil (Transliteration):** *Yen use aaguthu:* Project-க்கு தேவையான libraries, dependecies-கள் மற்றும் run commands-களை create செய்து manage பண்ண பயன்படுகிறது.
* **Tamil:** நம்முடைய project-க்கு தேவையான libraries (libraries/packages) மற்றும் run commands-களை நிர்வகிக்க இது பயன்படுகிறது.

#### 2. `vite.config.js`
* **English:** Configures the Vite Bundler to compile React elements efficiently and manage local plugins.
* **Tamil (Transliteration):** *Yen use aaguthu:* React code-ஐ build பண்ணும்போது Vite compiler-க்கான configuration-ஐ settings செய்ய பயன்படுகிறது.
* **Tamil:** React application-ஐ அதிவேகமாக compile செய்ய Vite build tool-ஐ configure செய்கிறது.

#### 3. `src/main.jsx`
* **English:** The entry point that mounts our `App` component into the primary DOM node in `index.html`.
* **Tamil (Transliteration):** *Yen use aaguthu:* Browser-ல் உள்ள HTML page-ல் React component-ஐ இணைக்கக்கூடிய முக்கிய ஆரம்ப புள்ளியாகும் (Entry Point).
* **Tamil:** நம்முடைய முழு React code-ஐயும் Browser-ன் HTML பக்கத்துடன் இணைக்கும் ஆரம்ப புள்ளியாகும்.

#### 4. `src/App.jsx`
* **English:** Holds the application's root Router (`HashRouter`), page-level routes, dynamic path settings, and handles dark/light theme switching on load.
* **Tamil (Transliteration):** *Yen use aaguthu:* Dashboard-ன் அனைத்து பக்கங்களுக்கான பாதைகளை (Routes/URL Paths) வரையறுக்கக்கூடிய முக்கிய கட்டுப்படுத்தி ஆகும்.
* **Tamil:** பக்கங்களை வழிநடத்தவும் (Routing), Dark/Light theme-ஐ ஆரம்பத்தில் load செய்யவும் பயன்படும் முக்கிய கோப்பாகும்.

#### 5. `src/services/taskService.js`
* **English:** Houses the simulation of a SaaS relational database. Uses `localStorage` to read and write employees, tasks, categories, and audit activities dynamically, so data persists when page reloads.
* **Tamil (Transliteration):** *Yen use aaguthu:* User input செய்யும் Data (Employees, Tasks)-ஐ LocalStorage database-ல் சேமிக்கவும், மாற்றவும், நீக்கவும் (CRUD actions) பயன்படுகிறது.
* **Tamil:** Database இல்லாததால், LocalStorage-ஐ பயன்படுத்தி தரவுகளை சேமிக்கவும், நிர்வகிக்கவும் தேவையான functions-களை கொண்டுள்ள முக்கிய சேவை கோப்பாகும்.

#### 6. `src/layouts/DashboardLayout.jsx`
* **English:** Unifies the layout containing the responsive Sidebar menu, top Navbar header, and dynamic content window using `<Outlet />`.
* **Tamil (Transliteration):** *Yen use aaguthu:* அனைத்து பக்கங்களுக்கும் பொதுவான Sidebar மற்றும் Navbar அமைப்பைத் தரும் ஒரு பொதுவான அடுக்கு (Layout Wrapper).
* **Tamil:** எல்லா பக்கங்களுக்கும் பொதுவான Sidebar மற்றும் Navbar தளவமைப்பை வழங்குகிறது.

#### 7. `src/pages/Login.jsx`
* **English:** User authentication gateway supporting mock admin and member login.
* **Tamil (Transliteration):** *Yen use aaguthu:* பயனர் Dashboard-க்குள் நுழைய மின்னஞ்சல் மற்றும் கடவுச்சொல்லை சரிபார்க்கும் பக்கம்.
* **Tamil:** பயனர்கள் லாகின் செய்யக்கூடிய முதன்மை பக்கம்.

#### 8. `src/pages/Dashboard.jsx`
* **English:** Shows stats dashboard counters (Total Tasks, Overdue, Complete Rates), workflow progress bar, and user workload charts.
* **Tamil (Transliteration):** *Yen use aaguthu:* நிறுவனத்தின் தற்போதைய வேலைகள் மற்றும் ஊழியர்களின் நிலையை வரைபடங்கள் (Charts) மூலம் அழகாக காட்டும் பக்கம்.
* **Tamil:** முக்கிய புள்ளிவிவரங்கள், தற்போதைய வேலைகள் மற்றும் வரைபடங்களை காட்டும் முகப்புப் பக்கம்.

#### 9. `src/pages/TaskManagement.jsx`
* **English:** Manages tasks list with quick status toggle, priority filters, global search, and action links.
* **Tamil (Transliteration):** *Yen use aaguthu:* அனைத்து Tasks-களையும் பட்டியலிட்டு, தேடி, வடிகட்ட (Filter) மற்றும் அவற்றை நிர்வகிக்கப் பயன்படுகிறது.
* **Tamil:** அனைத்து வேலைகளையும் பட்டியல் போட்டு காட்டவும், அவற்றை வடிகட்டவும் உதவும் பக்கமாகும்.

#### 10. `src/pages/CreateTask.jsx`
* **English:** User form page to generate a new task, set assignee, select categories, choose priority, set deadlines, and add comments.
* **Tamil (Transliteration):** *Yen use aaguthu:* புதிய வேலைகளை (Tasks) உருவாக்கி, தகுதியான நபர்களுக்கு ஒதுக்கீடு (Assign) செய்யப் பயன்படும் படிவம்.
* **Tamil:** புதிய வேலைகளை உருவாக்க பயன்படும் Form ஆகும்.

#### 11. `src/pages/TaskDetails.jsx`
* **English:** Interactive task logging page. Shows detailed description, allows remark updates, logs historical changes (Timeline), and supports task deletion.
* **Tamil (Transliteration):** *Yen use aaguthu:* ஒரு குறிப்பிட்ட வேலையின் முழு விவரங்களையும், அதன் மாறும் நிலைகளையும் (Timeline) விரிவாகக் காட்டும் பக்கம்.
* **Tamil:** ஒரு வேலையின் முழு வரலாறு மற்றும் தற்போதைய நிலையை அறியும் பக்கமாகும்.

#### 12. `src/pages/EmployeeView.jsx`
* **English:** General dashboard to view employee performance, workloads, pending tasks, and completion metrics.
* **Tamil (Transliteration):** *Yen use aaguthu:* ஊழியர்களின் வேலை சுமை (Workload) மற்றும் அவர்கள் முடித்த வேலைகளின் எண்ணிக்கையை கண்காணிக்க உதவும் பக்கம்.
* **Tamil:** எந்தெந்த ஊழியர்களுக்கு எவ்வளவு வேலைகள் உள்ளன என்று காட்டும் பக்கமாகும்.

#### 13. `src/pages/EmployeeDirectory.jsx`
* **English:** Displays comprehensive company staff listing cards with quick filter choices by role.
* **Tamil (Transliteration):** *Yen use aaguthu:* நிறுவனத்தின் அனைத்து ஊழியர்களின் தொடர்பு விவரங்களை அழகாக அட்டைகளாக (Cards) காட்டும் பக்கம்.
* **Tamil:** ஊழியர்களின் தொடர்பு விவரப் பக்கமாகும்.

#### 14. `src/pages/EmployeeProfileView.jsx`
* **English:** Beautiful details display card of a specific selected employee.
* **Tamil (Transliteration):** *Yen use aaguthu:* ஒரு குறிப்பிட்ட ஊழியரின் முழு சுயவிவர அட்டை மற்றும் வேலை விவரங்களை விரிவாக பார்க்க பயன்படுகிறது.
* **Tamil:** தனிப்பட்ட ஒரு ஊழியரின் சுயவிவரப் பக்கமாகும்.

#### 15. `src/pages/EmployeeDetails.jsx`
* **English:** Allows the currently logged-in user to customize their profile parameters (Name, Profile Pic, Location, Bio ID, Mobile, Aadhar).
* **Tamil (Transliteration):** *Yen use aaguthu:* Login செய்துள்ள நபர் தனது சுய விவரங்களை (Profile details, Aadhar, Mobile) திருத்தவோ, புதுப்பிக்கவோ உதவும் பக்கம்.
* **Tamil:** லாகின் செய்த பயனர் தனது சொந்த விவரங்களை மேம்படுத்தும் பக்கமாகும்.

#### 16. `src/pages/AdminEmployees.jsx`
* **English:** Restricted panel enabling managers to create new employee profiles or update specific profiles in the database directory.
* **Tamil (Transliteration):** *Yen use aaguthu:* புதிய ஊழியர்களை சேர்க்க அல்லது அவர்களின் பதவிகளை மாற்ற Admin-க்கு மட்டுமேயான பிரத்யேக பக்கம்.
* **Tamil:** புதிய ஊழியர்களை சேர்க்கும் நிர்வாக பக்கமாகும்.

#### 17. `src/pages/Categories.jsx`
* **English:** Analytics showing progress metrics, percentages, and completed task charts mapped by department categories.
* **Tamil (Transliteration):** *Yen use aaguthu:* வேலை பிரிவுகளை (HR, Engineering, Legal) உருவாக்கி, அவற்றின் முன்னேற்றத்தை சதவீத கணக்கில் பார்க்க உதவும் பக்கம்.
* **Tamil:** ஒவ்வொரு துறை வாரியாக வேலைகளின் சதவீத முன்னேற்றத்தை காட்டும் பக்கமாகும்.

#### 18. `src/pages/Reports.jsx`
* **English:** Exports tasks list to dynamic PDF reports and Excel sheets filtered by custom time spans.
* **Tamil (Transliteration):** *Yen use aaguthu:* குறிப்பிட்ட தேதிகளுக்குள் நடந்த வேலைகளை PDF அல்லது Excel File ஆக Download செய்யப் பயன்படும் பக்கம்.
* **Tamil:** அறிக்கைகளை PDF அல்லது Excel கோப்பாக பதிவிறக்க உதவும் பக்கமாகும்.

#### 19. `src/pages/Settings.jsx`
* **English:** Customizes theme toggles (Dark/Light), resets local databases, and configures email notification simulator status.
* **Tamil (Transliteration):** *Yen use aaguthu:* Dashboard-ன் Themes (இருண்ட/ஒளி), Database Reset மற்றும் Notification-களை கட்டுப்படுத்தும் அமைப்புகள் பக்கம்.
* **Tamil:** செயலியில் சில முக்கிய மாற்றங்களை செய்ய உதவும் அமைப்புகள் பக்கமாகும்.

---

## 🔑 Login & Access Credentials (உள்நுழைவு விவரங்கள்)

Our local mock database service comes preloaded with an interactive administrative account and supports dynamic employee login:

### 1. Admin Login (நிர்வாகி கணக்கு)
* **Email:** `kayal@gmail.com`
* **Password:** `12345678`
* **Privileges:** Access to **Add Employees** dashboard, detailed report downloads, global task deletion, and full SaaS workload settings.

### 2. General Employee Login (ஊழியர் கணக்கு)
* **Email:** Any standard email format (e.g. `emma@company.com` or `newuser@gmail.com`)
* **Password:** Any password length/characters.
* **Functionality:** Logging in with a new email automatically generates a new profile card with a customizable random avatar prefix in the mock local list.

---

## 🏃‍♂️ Step-by-Step Execution Guide (பயன்படுத்துவதற்கான எளிய வழிமுறைகள்)

Follow these precise sequential commands to run the application locally on your computer:

### Step 1: Install Node.js (Node.js நிறுவுதல்)
Ensure Node.js is installed on your computer. You can check using terminal:
```bash
node -v
```
*(Yen use aaguthu: JavaScript packages மற்றும் dev server-ஐ நம் கம்ப்யூட்டரில் இயக்க இதுதான் அஸ்திவாரம்).*

### Step 2: Extract / Navigate into Directory (கோப்புறையை அடைதல்)
Open your terminal (PowerShell / Command Prompt) and make sure you are inside the root folder:
```powershell
# In Windows PowerShell:
cd d:\Navanala_task
```
*(Yen use aaguthu: இந்த folder-க்குள் தான் package.json இருப்பதால், இங்கிருந்துதான் npm commands-ஐ இயக்க வேண்டும்).*

### Step 3: Install Project Libraries (தேவையானவற்றை நிறுவுதல்)
Run the NPM installer to download and build all application dependencies in the project:
```bash
npm install
```
*(Yen use aaguthu: React, React Router, TailwindCSS, jsPDF போன்ற அனைத்து libraries-களையும் download செய்து node_modules என்ற Folder-ல் சேமிக்கும்).*

### Step 4: Run Development Server (உள்ளூர் சேவையகத்தை இயக்குதல்)
Launch the rapid Vite compiler server:
```bash
npm run dev
```
*(Yen use aaguthu: இது ஒரு Local Web Server-ஐ உருவாக்கும். நாம் Code-ல் செய்யும் மாற்றங்கள் உடனுக்குடன் Browser-ல் load ஆக (Hot Module Replacement) இது பயன்படுகிறது).*

Once launched, look at the terminal to find the local URL. Normally, it is:
👉 **`http://localhost:5173/`** or **`http://localhost:5173/#/login`**

### Step 5: Build for Production (தயாரிப்புக்கு மாற்றுதல்)
To export optimized standalone static HTML/JS/CSS assets ready for live hosting:
```bash
npm run build
```
*(Yen use aaguthu: Code-களை சுருக்கி (minify), இணையதளத்தில் Deploy செய்வதற்கு உகந்த 'dist' Folder-ஐ உருவாக்க இது பயன்படுகிறது).*

---

## ✨ Outstanding UI Features (சிறப்பான வடிவமைப்பு அம்சங்கள்)

1. **Vibrant HSL Theme Engine:** Designed with tailored dark-mode gradients using high contrast text overlays, glassmorphic container panels, and soft premium shadows.
2. **Dynamic Workload Cards:** Visual display showing detailed task summaries for employees.
3. **Smooth Local Storage Synchronization:** Immediate state updates for tasks, profile photos, custom tags, and activity audits across separate router screens.
4. **Rich PDF / Excel Exports:** Download formatted task reports instantly using standard client-side compilers without server delays.

---
*Created with ♥ for Navanala Workspace.*
