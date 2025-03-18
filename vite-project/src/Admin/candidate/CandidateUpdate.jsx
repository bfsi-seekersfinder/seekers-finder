import { useState } from "react";

const CandidateUpdateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    currentCompany: "",
    currentDesignation: "",
    noticePeriod: "",
    product: "",
    education: "",
    location: { state: "", city: "" },
    salary: "",
    prevCompanies: [{ company: "", designation: "", product:"" }],
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      location: { ...formData.location, [name]: value },
    });
  };

  const handlePrevCompanyChange = (index, field, value) => {
    const updatedPrevCompanies = formData.prevCompanies.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({ ...formData, prevCompanies: updatedPrevCompanies });
  };

  const addPrevCompany = () => {
    setFormData({
      ...formData,
      prevCompanies: [...formData.prevCompanies, { company: "", designation: "" }],
    });
  };

  const removePrevCompany = (index) => {
    setFormData({
      ...formData,
      prevCompanies: formData.prevCompanies.filter((_, i) => i !== index),
    });
  };

  return (
    <form className="space-y-4 p-4 border rounded-lg shadow-md">
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="text" name="contactNo" placeholder="Contact No" value={formData.contactNo} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="text" name="currentCompany" placeholder="Current Company" value={formData.currentCompany} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="text" name="currentDesignation" placeholder="Current Designation" value={formData.currentDesignation} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="text" name="noticePeriod" placeholder="Notice Period" value={formData.noticePeriod} onChange={handleChange} className="w-full p-2 border rounded" />
      <input type="text" name="product" placeholder="Product" value={formData.product} onChange={handleChange} className="w-full p-2 border rounded" />
      
      <select name="education" value={formData.education} onChange={handleChange} className="w-full p-2 border rounded">
        <option value="">Select Education</option>
        <option value="Bachelor's">Bachelor's</option>
        <option value="Master's">Master's</option>
        <option value="PhD">PhD</option>
      </select>

      <div className="grid grid-cols-2 gap-2">
        <select name="state" value={formData.location.state} onChange={handleLocationChange} className="p-2 border rounded">
          <option value="">Select State</option>
          <option value="State1">State1</option>
          <option value="State2">State2</option>
        </select>
        <select name="city" value={formData.location.city} onChange={handleLocationChange} className="p-2 border rounded">
          <option value="">Select City</option>
          <option value="City1">City1</option>
          <option value="City2">City2</option>
        </select>
      </div>
      
      <input type="text" name="salary" placeholder="Salary" value={formData.salary} onChange={handleChange} className="w-full p-2 border rounded" />
      
      <div>
        <label>Gender:</label>
        <div className="flex gap-4">
          <label><input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
          <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
        </div>
      </div>
      
      <div>
        <label>Previous Companies:</label>
        {formData.prevCompanies.map((prev, index) => (
          <div key={index} className="flex gap-2 mt-2">
            <input type="text" placeholder="Previous Company" value={prev.company} onChange={(e) => handlePrevCompanyChange(index, 'company', e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Previous Designation" value={prev.designation} onChange={(e) => handlePrevCompanyChange(index, 'designation', e.target.value)} className="p-2 border rounded" />
            <input type="text" placeholder="Previous Designation" value={prev.product} onChange={(e) => handlePrevCompanyChange(index, 'product', e.target.value)} className="p-2 border rounded" />
            <button type="button" onClick={() => removePrevCompany(index)} className="p-2 bg-red-500 text-white rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={addPrevCompany} className="mt-2 p-2 bg-blue-500 text-white rounded">Add Previous Company</button>
      </div>
    </form>
  );
};

export default CandidateUpdateForm;
