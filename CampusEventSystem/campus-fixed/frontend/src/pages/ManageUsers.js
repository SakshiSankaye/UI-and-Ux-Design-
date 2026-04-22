import { useEffect, useState } from "react";
import { getUsers } from "../services/adminApi";

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await getUsers();
            setUsers(data || []);
        } catch (err) {
            console.error(err);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">

            <h2 className="text-xl font-bold mb-4">Users</h2>

            {/* Loading */}
            {loading && <p>Loading users...</p>}

            {/* Error */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Table */}
            {!loading && !error && (
                <table className="w-full border">

                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Name</th>
                            <th className="p-2">Email</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="2" className="text-center p-4">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map(user => (
                                <tr key={user._id} className="border-t">
                                    <td className="p-2">{user.name}</td>
                                    <td className="p-2">{user.email}</td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </table>
            )}

        </div>
    );
}

export default ManageUsers;