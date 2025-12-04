import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const API_URL = import.meta.env.VITE_API_URL; // <-- environment variable

    const fetchPendingUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/user/pending`);
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const verifyUser = async (uid) => {
        try {
            const res = await fetch(`${API_URL}/api/user/verify/${uid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to verify user");
            await res.json();
            fetchPendingUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const changeRole = async (uid, role) => {
        try {
            const res = await fetch(`${API_URL}/api/user/role/${uid}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role }),
            });
            if (!res.ok) throw new Error("Failed to change role");
            await res.json();
            fetchPendingUsers();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Verified</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: "center" }}>
                                No pending users
                            </td>
                        </tr>
                    )}
                    {users.map((user) => (
                        <tr key={user.uid}>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.phone}</td>
                            <td>{user.isVerified ? "Yes" : "No"}</td>
                            <td>{user.role}</td>
                            <td>
                                {!user.isVerified && (
                                    <button onClick={() => verifyUser(user.uid)}>Verify</button>
                                )}
                                <select
                                    value={user.role}
                                    onChange={(e) => changeRole(user.uid, e.target.value)}
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
