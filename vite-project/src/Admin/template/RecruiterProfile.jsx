import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../../Global/userContext";
import { FaUserCircle, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaBriefcase, FaBuilding } from "react-icons/fa";

const RecruiterProfile = () => {
    const url = import.meta.env.VITE_API_URI 
    const { user, setUser } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
        try {
        const response = await axios.get(url+"/api/account/me", { withCredentials: true });
        setUser(response.data.user);
        setLoading(false);
        } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
        }
        };
        fetchUserProfile();
    }, [setUser]);

    if (loading) return <div className="text-center text-gray-600">Loading Profile...</div>;
    if (!user) return <div className="text-center text-red-500">User not found.</div>;

    return (
        <div className="w-[500px] bg-white p-6 shadow-md rounded-md mt-6">
            {/* User Header */}
            <div className="flex items-center space-x-4 border-b pb-4">
                <FaUserCircle className="text-6xl text-gray-400" />
                <div>
                    <h1 className="text-2xl font-bold">{user.recruiterName || "N/A"}</h1>
                    <p className="text-gray-600">{user.role || "Not Assigned"}</p>
                </div>
                <FaEdit className="text-blue-500 ml-auto cursor-pointer text-xl hover:text-blue-700" title="Edit Profile" />
            </div>

            {/* Contact Information */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p className="flex items-center text-gray-700"><FaEnvelope className="mr-2" /> {user.email || "N/A"}</p>
                    <p className="flex items-center text-gray-700"><FaPhone className="mr-2" /> {user.contactNo || "N/A"}</p>
                </div>
            </div>

            {/* Location */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Location</h2>
                <p className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2" /> {user.location?.city || "N/A"}, {user.location?.state || "N/A"}, {user.location?.landMark || "N/A"}</p>
            </div>

            {/* Professional Details */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Professional Details</h2>
                <p className="flex items-center text-gray-700"><FaBuilding className="mr-2" /> {user.currentCompany || "Not Available"}</p>
                <p className="flex items-center text-gray-700"><FaBriefcase className="mr-2" /> {user.currentDesignation || "Not Available"}</p>
            </div>

            {/* Business IDs */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2">Business Identification</h2>
                <p className="text-gray-700">PAN No: {user.PAN || "N/A"}</p>
                <p className="text-gray-700">GST No: {user.GST || "N/A"}</p>
                <p className="text-gray-700">TAN No: {user.TAN || "N/A"}</p>
            </div>

            {/* Alias Users */}
            {user.alias && user.alias.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Alias Users</h2>
                    {user.alias.map((alias, index) => (
                        <div key={index} className="p-3 border rounded-md mb-2">
                            <p className="font-semibold">{alias.aliasName || "N/A"}</p>
                            <p className="text-gray-600">Role: {alias.aliasRole || "N/A"}</p>
                            <p className="text-gray-600">Email: {alias.aliasEmail || "N/A"}</p>
                            <p className="text-gray-600">Contact: {alias.aliasContactNo || "N/A"}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecruiterProfile;
