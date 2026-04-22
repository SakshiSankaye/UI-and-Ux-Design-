/* eslint-disable */
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login          from "./pages/Login";
import Signup         from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";

// ADMIN
import AdminLayout    from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ManageUsers    from "./pages/ManageUsers";
import ManageEvents   from "./pages/ManageEvents";

// ORGANIZER
import OrganizerLayout       from "./layouts/OrganizerLayout";
import OrganizerDashboard    from "./pages/OrganizerDashboard";
import OrganizerCreateEvent  from "./pages/OrganizerCreateEvent";
import OrganizerManageEvents from "./pages/OrganizerManageEvents";
import OrganizerEditEvent    from "./pages/OrganizerEditEvent";
import Participants          from "./pages/Participants";
import Attendance            from "./pages/Attendance";

// STUDENT
import StudentLayout    from "./layouts/StudentLayout";
import StudentDashboard from "./pages/students/StudentDashboard";
import BrowseEvents     from "./pages/students/BrowseEvents";
import EventDetails     from "./pages/students/eventdetails";
import RegisterForm     from "./pages/students/registerform";
import MyRegistrations  from "./pages/students/MyRegistrations";
import Notifications    from "./pages/students/Notifications";
import UserProfile      from "./pages/students/UserProfile";
import CalendarView     from "./pages/students/CalendarView";
import AttendanceMark   from "./pages/students/AttendanceMark";

// OTHER
import StudentCertificates from "./pages/StudentCertificates";
import StudentSettings     from "./pages/StudentSettings";
import Profile             from "./pages/Profile";
import Reports             from "./pages/Reports";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* AUTH */}
                <Route path="/"                      element={<Login />} />
                <Route path="/signup"                element={<Signup />} />
                <Route path="/forgot-password"       element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* STUDENT — all wrapped in RegistrationProvider via StudentLayout */}
                <Route path="/student" element={<StudentLayout />}>
                    <Route path="dashboard"            element={<StudentDashboard />} />
                    <Route path="browse"               element={<BrowseEvents />} />
                    <Route path="calendar"             element={<CalendarView />} />
                    <Route path="event/:id"            element={<EventDetails />} />
                    <Route path="register/:id"         element={<RegisterForm />} />
                    <Route path="registrations"        element={<MyRegistrations />} />
                    <Route path="notifications"        element={<Notifications />} />
                    <Route path="profile"              element={<UserProfile />} />
                    <Route path="attendance/:sessionId" element={<AttendanceMark />} />
                    <Route path="certificates"         element={<StudentCertificates />} />
                    <Route path="settings"             element={<StudentSettings />} />
                </Route>

                {/* ORGANIZER */}
                <Route path="/organizer" element={<OrganizerLayout />}>
                    <Route path="dashboard"     element={<OrganizerDashboard />} />
                    <Route path="create-event"  element={<OrganizerCreateEvent />} />
                    <Route path="manage-events" element={<OrganizerManageEvents />} />
                    <Route path="edit-event/:id" element={<OrganizerEditEvent />} />
                    <Route path="participants"   element={<Participants />} />
                    <Route path="attendance"     element={<Attendance />} />
                </Route>

                {/* ADMIN */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users"     element={<ManageUsers />} />
                    <Route path="events"    element={<ManageEvents />} />
                </Route>

                {/* COMMON */}
                <Route path="/profile"  element={<Profile />} />
                <Route path="/reports"  element={<Reports />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
