import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/MainNavbar";
import API from "../services/api";

function CreateEvent() {

    const navigate = useNavigate();

    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        category: "",
        type: "Offline",
        link: "",
        maxParticipants: "",
        deadline: "",
        tags: "",
        image: null
    });

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // HANDLE IMAGE
    const handleImage = (e) => {
        const file = e.target.files[0];
        setForm({ ...form, image: file });

        ```
if (file) {
  setPreview(URL.createObjectURL(file));
}
```

    };

    // SUBMIT
    const submit = async (e) => {
        e.preventDefault();


        if (!form.title || !form.date) {
            alert("Please fill required fields");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("description", form.description);
            formData.append("date", form.date);
            formData.append("time", form.time);
            formData.append("venue", form.location);
            formData.append("category", form.category);
            formData.append("type", form.type);
            formData.append("link", form.link);
            formData.append("maxParticipants", form.maxParticipants);
            formData.append("deadline", form.deadline);
            formData.append("tags", form.tags);

            if (form.image) {
                formData.append("image", form.image);
            }

            await API.post("/events/create", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Event Created Successfully 🚀");
            navigate("/admin/events");

        } catch (err) {
            console.log("ERROR:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to create event");
        }

    };

    return (<div className="flex bg-gray-100 min-h-screen">


        <AdminSidebar />

        <div className="flex-1">

            <AdminNavbar />

            <div className="p-8">

                <h2 className="text-3xl font-bold mb-6">Create Event</h2>

                <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow-lg space-y-6 max-w-4xl">

                    <input
                        name="title"
                        placeholder="Event Title"
                        className="border p-2 w-full"
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Event Description"
                        className="border p-2 w-full"
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="date"
                        className="border p-2"
                        onChange={handleChange}
                    />

                    <input
                        type="time"
                        name="time"
                        className="border p-2"
                        onChange={handleChange}
                    />

                    <input
                        name="location"
                        placeholder="Venue"
                        className="border p-2"
                        onChange={handleChange}
                    />

                    <button className="bg-blue-600 text-white px-4 py-2 rounded">
                        Create Event 🚀
                    </button>

                </form>

            </div>

        </div>
    </div>


    );
}

export default CreateEvent;
