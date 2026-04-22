import API from "./api";

export const getEvents = async () => {
    const res = await API.get("/api/events/my-events");
    return res.data;
};

export const getEventById = async (id) => {
    const res = await API.get(`/api/events/${id}`);
    return res.data;
};

export const updateEvent = async (id, data) => {
    const res = await API.put(`/api/events/${id}`, data);
    return res.data;
};

export const createEvent = async (data) => {
    const res = await API.post("/api/events/create", data);
    return res.data;
};

export const deleteEvent = async (id) => {
    const res = await API.delete(`/api/events/${id}`);
    return res.data;
};
