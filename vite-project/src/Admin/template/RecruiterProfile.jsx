import { useEffect, useState, useContext } from "react";
import getDuration from "../../../Generators/getDuration";
import { FaUserCircle, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaBriefcase, FaBuilding } from "react-icons/fa";

const RecruiterProfile = ({user}) => {
    const url = import.meta.env.VITE_API_URI 
    const [loading, setLoading] = useState(true);

    
    if (!user) return <div className="text-center text-red-500">Log in Again.</div>;

    return (
        <div className="w-[500px] p-6 rounded-md">
            <div className="mb-4  flex justify-end gap-2">
                <span className="border border-slate-300 px-4 rounded bg-gray-100 text-slate-600 text-sm flex items-center">{user.plan}</span>
                <span className={` items-center px-4 rounded border text-slate-600 border-slate-300 py-0.5  text-sm`}> <span className={`${user.planActive?" text-red-500 ": 'text-emerald-500'}`}>{user.planActive? "Expired" : "Active"} </span>  </span>
            </div>

            {/* User Header */}
            <div className="flex gap-4 items-center space-x-4 border-b pb-4">
                <FaUserCircle className="text-6xl text-gray-400" />
                <div>
                    <h1 className="text-2xl font-bold">{user.recruiterName || "N/A"}</h1>
                    <p className="text-gray-600">{user.role || "Not Assigned"}</p>
                </div>

            </div>

            {/* Contact Information */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-cyan-700">Contact Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <p className="flex items-center text-gray-700"><FaEnvelope className="mr-2" /> {user.email || "N/A"}</p>
                    <p className="flex items-center text-gray-700"><FaPhone className="mr-2" /> {user.contactNo || "N/A"}</p>
                </div>
            </div>

            {/* Location */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-cyan-700">Location</h2>
                <p className="flex items-center text-gray-700"><FaMapMarkerAlt className="mr-2" /> {user.location?.city || "N/A"}, {user.location?.state || "N/A"}, {user.location?.landMark || "N/A"}</p>
            </div>

            {/* Professional Details */}
            <div className="mt-4 flex flex-col gap-2 ">
                <h2 className="text-lg font-semibold mb-2 text-cyan-700">Professional Details</h2>
                <p className="flex items-center text-gray-700"><FaBuilding className="mr-2" /> {user.currentCompany || "Not Available"}</p>
                <p className="flex items-center text-gray-700"><FaBriefcase className="mr-2" /> {user.currentDesignation || "Not Available"}</p>
            </div>

            {/* Business IDs */}
            <div className="mt-4">
                <h2 className="text-lg font-semibold mb-2 text-cyan-700">Business Identification</h2>
                <p className="text-gray-700">PAN No: {user.PAN || "N/A"}</p>
                <p className="text-gray-700">GST No: {user.GST || "N/A"}</p>
                <p className="text-gray-700">TAN No: {user.TAN || "N/A"}</p>
            </div>

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
