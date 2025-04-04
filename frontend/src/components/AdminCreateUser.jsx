import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminCreateUser = () => {
    const {user} = useAuthContext()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "admin",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle text input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);

        // Preview image
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
    
        const formDataToSend = new FormData();
        formDataToSend.append("first", formData.firstName);
        formDataToSend.append("last", formData.lastName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("role", formData.role);
    
        if (profileImage) {
            formDataToSend.append("profileImage", profileImage);
        }
    
        try {
            const response = await fetch("/api/admin/create_user", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
                body: formDataToSend,  // Send FormData instead of JSON
            });
    
            const data = await response.json();
            if (response.ok) {
                setMessage("✅ User created successfully!");
                // setFormData({ firstName: "", lastName: "", email: "", password: "", role: "admin" });
                // setProfileImage(null);
                // setPreviewImage(null);
            } else {
                setMessage(`❌ ${data.error}`);
            }
        } catch (error) {
            setMessage("❌ An error occurred while creating the user.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create New User</h2>

            {message && <p className="text-center p-2 rounded-md text-sm font-medium bg-gray-100">{message}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
                />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring focus:ring-blue-300"
                >
                    <option value="admin">Admin</option>
                    <option value="driver">Driver</option>
                    <option value="paramedic">Paramedic</option>
                    <option value="callop">Call Operator</option>
                    <option value="manager">Manager</option>
                    <option value="maintainer">Maintainer</option>
                    <option value="hospital_staff">Hospital Staff</option>
                </select>

                {/* Image Upload */}
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
                    />
                </div>

                {/* Image Preview */}
                {previewImage && (
                    <div className="mt-2 flex justify-center">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="w-24 h-24 rounded-lg border border-gray-300 object-cover"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-white font-semibold ${
                        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                    } transition`}
                >
                    {loading ? "Creating..." : "Create User"}
                </button>
            </form>
        </div>
    );
};

export default AdminCreateUser;
