import { useState, useEffect } from "react";

const CreateCandidate = () => {
    const [formData, setFormData] = useState({
        username:"",
        designation: "",
        company: "",
        experience: "",
        noticePeriod: "",
        currentCTC: "",
        previousCompanies: [""],
        education: [""],
        preferredLocation: [{
            region:"" || "india",
            state:"",
            district:"",
            zip:"",
        }],
        keySkills: [],
        cv: [],
    });

    useEffect(() => {
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === "object" && !Array.isArray(value)) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                });
            } else {
            }
        });
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (index, type, value) => {
        const updatedArray = [...formData[type]];
        updatedArray[index] = value;
        setFormData({ ...formData, [type]: updatedArray });
    };
    const handleLocationChange = (index, type, value) => {
        const updatedArray = [...formData.preferredLocation];
        updatedArray[index] ={ 
            ...updatedArray[index], [type] : value
        }
            setFormData({ ...formData, preferredLocation: updatedArray })
    };

    const addField = (type) => {
        setFormData({ ...formData, [type]: [...formData[type], ""] });
    };

    const handleKeySkillChange = (e) => {
        setFormData({ ...formData, keySkills: e.target.value.split(",") });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, cv: e.target.files[0] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="w-full flex flex-col  mx-auto p-6   shadow-lg ">
            <h2 className="text-xl font-bold mb-4">Create Condidate</h2>
            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col px-6">
                {/* Basic Info Fields */}
                <input type="text" id="designation" name="username" placeholder="Condidate Name" value={formData.username} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none"/>
                <input type="text" id="designation" name="designation" placeholder="Current Designation" value={formData.designation} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none"/>
                <input type="text" name="company" placeholder="Current Company" value={formData.company} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                <input type="text" name="experience" placeholder="Total Experience (years)" value={formData.experience} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                <input type="text" name="noticePeriod" placeholder="Notice Period" value={formData.noticePeriod} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                <input type="text" name="currentCTC" placeholder="Current CTC" value={formData.currentCTC} onChange={handleChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                <label className="font-semibold">Location</label>
                {
                    formData.preferredLocation.map((location, index)=> (
                        <div key={index} className="flex flex-col gap-2">
                            <input type="text" name="state" value={location.state} onChange={(e)=> handleLocationChange(index, "state",  e.target.value)} placeholder="State"className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                            <input type="text" name="district" value={location.district} onChange={(e)=> handleLocationChange(index, "district",  e.target.value)} placeholder="District"className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                            <input type="text" name="zip" value={location.zip} onChange={(e)=> handleLocationChange(index, "zip",  e.target.value)} placeholder="Zip"className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                            <input type="text" value={location.region} readOnly  placeholder="india"className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />
                        </div>
                        
                    ))
                }

                {/* Dynamic Previous Companies */}
                <label className="font-semibold">Previous Companies</label>
                {formData.previousCompanies.map((company, index) => (
                    <input key={index} type="text" value={company} onChange={(e) => handleArrayChange(index, "previousCompanies", e.target.value)} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" placeholder="Previous Company Name" />
                ))}
                <button type="button" onClick={() => addField("previousCompanies")} className="btn border border-slate-400 w-[150px] rounded-2xl bg-gray-200 text-slate-600 font-semibold cursor-pointer flex justify-center items-center">+ Add Company</button>

                {/* Dynamic Education */}
                <label className="font-semibold">Education</label>
                {formData.education.map((edu, index) => (
                    <input key={index} type="text" value={edu} onChange={(e) => handleArrayChange(index, "education", e.target.value)} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" placeholder="e.g. 12th Rajasthan Board" />
                ))}
                <button type="button" onClick={() => addField("education")} className=" border border-slate-400 w-[150px] rounded-2xl bg-gray-200 text-slate-600 font-semibold cursor-pointer">+ Add Education</button>

                {/* Key Skills */}
                <input type="text" name="keySkills" placeholder="Key Skills (comma separated)" value={formData.keySkills.join(",")} onChange={handleKeySkillChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />

                {/* Upload CV */}
                <label className="font-semibold">Upload CV</label>
                <input type="file" onChange={handleFileChange} className="input-field px-4 py-0.5 border border-slate-400 w-[400px] focus:outline-none" />

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary border py-1 border-slate-400 w-[400px] rounded-2xl bg-gray-200 text-slate-600 font-semibold cursor-pointer">Submit</button>
            </form>
        </div>
    );
}

export default CreateCandidate;