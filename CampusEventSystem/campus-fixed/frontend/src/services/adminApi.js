import API from "./api";

/* ── DASHBOARD STATS ────────────────────────────────────── */
export const getStats = async () => {
    try {
        // Fixed: was calling /admin/stats which didn't exist
        const res = await API.get("/api/dashboard/admin/stats");
        return res.data;
    } catch (error) {
        console.error("Error fetching stats:", error);
        return { users: 0, events: 0, registrations: 0, pendingCount: 0 };
    }
};

/* ── EVENTS ──────────────────────────────────────────────── */
export const getEvents = async () => {
    try {
        const res = await API.get("/api/events");
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
};

export const getPendingEvents = async () => {
    try {
        const res = await API.get("/api/events/pending");
        return res.data;
    } catch (error) {
        console.error("Error fetching pending events:", error);
        return [];
    }
};

export const approveEvent = async (id) => {
    try {
        const res = await API.put(`/api/events/approve/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error approving event:", error);
        return null;
    }
};

export const rejectEvent = async (id) => {
    try {
        const res = await API.put(`/api/events/reject/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error rejecting event:", error);
        return null;
    }
};

export const deleteEvent = async (id) => {
    try {
        const res = await API.delete(`/api/events/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        return null;
    }
};

/* ── USERS ───────────────────────────────────────────────── */
export const getUsers = async () => {
    try {
        const res = await API.get("/api/users");
        return res.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const updateEvent = async (id, data) => {
    try {
        const res = await API.put(`/api/events/${id}`, data);
        return res.data;
    } catch (error) {
        console.error("Error updating event:", error);
        return null;
    }
};

export const getEventById = async (id) => {
    try {
        const res = await API.get(`/api/events/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching event:", error);
        return null;
    }
};
