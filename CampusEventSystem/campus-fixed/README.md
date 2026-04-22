# Campus Event Management System

**A full-stack campus event management platform with role-based dashboards and real-time notifications.**
---

##  Description

The **Campus Event Management System** is a web application designed to streamline the process of managing college events — from creation and approval to student registration and participation tracking.

### What It Does

* **Organizers** can create and manage events, track participants, and export reports.
* **Students** can browse events, register, receive notifications, and manage their registrations.
* **Admins** can control the platform by approving events and managing users.

### Real-World Use Case

This system replaces manual event handling processes like paper registrations and spreadsheets with a centralized digital platform, improving efficiency and transparency in campus event management.

---

## Features

###  Student Features

* Browse all approved events
* Register for events
* View **My Registrations**
* Calendar view of registered events
* Receive notifications and reminders
* Update profile and settings
* Submit feedback

---

###  Organizer Features

* Create new events
* Edit and delete events
* View participant list
* Export participants (PDF / Excel)
* Organizer dashboard with statistics

---

### Admin Features

* View platform statistics
* Approve or reject events
* Manage users (view/update/delete)
* Manage all events

---

###  System Features

* JWT Authentication (Login/Signup)
* Role-based access control
* Protected routes
* Notification system

---

##  Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Big Calendar
* Recharts

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

### Tools

* Cloudinary (Image Upload)
* PDFKit (Reports)
* ExcelJS
* dotenv

---

##  Folder Structure

```
campus-fixed/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── layouts/
    │   └── App.js
    └── package.json
```

---

##  Installation & Setup

### Prerequisites

* Node.js
* MongoDB
* Git

---

### 1. Clone Repository

```bash
git clone https://github.com/Pallavi10-More/full-stack-development
cd campus-event-system
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campus_events
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

##  Usage

### Students

* Sign up and login
* Browse events
* Register for events
* View registrations

### Organizers

* Create events
* Manage events
* View participants

### Admin

* Approve events
* Manage users

---

## API Overview

### Auth

* POST `/api/auth/signup`
* POST `/api/auth/login`

### Events

* GET `/api/events/approved`
* POST `/api/events/create`
* PUT `/api/events/:id`
* DELETE `/api/events/:id`

### Registrations

* POST `/api/registrations`
* GET `/api/registrations/my`

### Users

* GET `/api/users`
* PUT `/api/users/:id`

---

## Future Enhancements

* Geo-location based attendance system
* Certificate generation system
* Email notifications
* QR-based check-in system
* Mobile application

---

## 👥 Author

**Developed by:** Pallavi More,Tanishka kadam,Sakshi sankaye.

---

## 📄 License

This project is licensed under the MIT License.
