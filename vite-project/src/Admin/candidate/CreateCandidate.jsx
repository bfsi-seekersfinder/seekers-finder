import { useState, useEffect } from "react";
import DateSelector from "../../../Global/DateSelector";
import axios from "axios";
import { Switch } from "@mui/material"
import { PuffLoader } from "react-spinners";

const UserForm = () => {
  const url = import.meta.env.VITE_API_URI;
  const [Product, setProduct] = useState([])
  const [FunctionalArea, setFunctionalArea] = useState([])
  const [UG, setUG] = useState([])
  const [PG, setPG] = useState([])
  const [skillInput, setSkillInput] = useState("");
  const [findCandidatedInput, setfindCandidatedInput] = useState('')
  const [isCandidateUpdate, setisCandidateUpdate] = useState(false)
  const [filterCandidates, setfilterCandidates] = useState([])
  const [selectedCandidate, setselectedCandidate] = useState()
  const [Loading, setLoading] = useState(false)
  const [successMessage, setsuccessMessage] = useState('')
  const [isCandidateSelect, setisCandidateSelect] = useState(false)


  const handleCandidateUpdate = () =>{
    setisCandidateUpdate(!isCandidateUpdate)
  }

  const initialData = {
    fullName: "",
    mobileNo: "",
    email: "",
    gender: "",
    product: "",
    yearsOfExperience: "",
    currentCompany: "",
    noticePeriod: "",
    currentCtc: "",
    workExperience: [],
    education: [{id:Date.now(), name:"", universityName:"", startDate:"", endDate:"",}],
    userLocation: {
      country:"",
      state:"",
      city:"",
    },
    maritalStatus: "",
    skills: [],
    cv: [],
  }

  const [formData, setFormData] = useState(initialData);


  const productData = async () => {      
    try {
      const res = await axios.get(`${url}/api/product`);
      
      if (Array.isArray(res.data.products)) setProduct(res.data.products);
      if (Array.isArray(res.data.funcArea)) setFunctionalArea(res.data.funcArea);
      if (Array.isArray(res.data.ug)) setUG(res.data.ug);
      if (Array.isArray(res.data.pg)) setPG(res.data.pg);
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    productData()

  }, [])


  const handleEducationChange = (e, id, field) => {
    const { value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      education: prevFormData.education.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addEducationField = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      education: [
        ...prevFormData.education,
        {id:Date.now(), name: "", universityName: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeEducationField = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== index),
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (index, field, value, key) => {
    const updatedArray = [...formData[key]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [key]: updatedArray });
  };

  const addArrayField = (key, emptyObject) => {
    setFormData({ ...formData, [key]: [...formData[key], emptyObject] });
  };

  const removeArrayField = (key, index) => {
    const updatedArray = [...formData[key]];
    updatedArray.splice(index, 1);
    setFormData({ ...formData, [key]: updatedArray });
  };

  const handleLocation = (e) => {
      const { name, value } = e.target;

      setFormData((prevFormData) => ({
          ...prevFormData,
          userLocation: {
              ...prevFormData.userLocation,
              [name]: value, // Dynamically updating country, state, or city
          },
      }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value, // Dynamically updates gender or maritalStatus
    }));
  };

  const handleSelectDates = (startDate, endDate, index) => {
    setFormData((prevFormData) => ({
        ...prevFormData,
        workExperience: prevFormData.workExperience.map((exp, i) =>
            i === index ? { ...exp, startDate, endDate } : exp
        ),
    }));
  };

  const noticePeriodOptions = [
    "Immediate Joiner",
    "15 Days",
    "30 Days",
    "45 Days",
    "60 Days",
    "90 Days",
  ];

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    setFormData((prevData) => ({
      ...prevData,
      cv: [...prevData.cv, ...files], 
    }));
  };

  const handleUpload = async () => {

    try {
      Loading(true)
      const response = await axios.post(url+'/api/create/candidate', formData,{
        headers: { "Content-Type": "application/json" },
      })

      setsuccessMessage(response.data.message)
      setTimeout(()=>setsuccessMessage(''), 3000)
      
    } catch (error) {
      console.log(error.message)
    }finally{
      setLoading(false)
      setFormData(initialData)
    }

  }

  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault(); // Prevent form submission on Enter
      const newSkill = skillInput.trim();

      if (newSkill !== "") {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, newSkill], // Add new skill
        }));
      }
      setSkillInput(""); // Reset input
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  useEffect(()=>{
  const findCandidate = async () => {
    try {
      if (!findCandidatedInput.trim() || !findCandidatedInput.length) {
        setfilterCandidates([]);
        return;
      }

      const candidate = findCandidatedInput
      const response = await axios.get(url+`/api/get/candidate/?candidate=${candidate}`, {
      headers: {"Content-Type" : "application/json"}
    })

    setfilterCandidates(response.data.candidates)
      
    } catch (error) {
      console.log(error.message)
    }
  }

  if(findCandidatedInput.length>0){
    findCandidate();
  }

  }, [findCandidatedInput])

  useEffect(()=>{
    if (!findCandidatedInput.trim() || !findCandidatedInput.length) {
    setfilterCandidates([]); 
    return;
  }
  },[findCandidatedInput])

  const handleSelectUpdateCandidate = (id) =>{
  setselectedCandidate([id])
  setisCandidateSelect(true)
  setfindCandidatedInput('')
  setfilterCandidates([])
  }

  const handleRemoveSelectedCandidate = () =>{
  setselectedCandidate([])
  setisCandidateSelect(false)
  setfindCandidatedInput('')
  setfilterCandidates([])
  }



  return (
    <>
    <div className="flex gap-4 ">

    <nav className="h-14 shadow fixed w-full pr-[20%] bg-slate-100 justify-end items-center flex text-black">
      <div className="px-4 rounded-full border border-slate-300 text-slate-600 flex items-center">
        <span className={`${isCandidateUpdate? "font-semibold text-emerald-600": ""}`}>Update Cadnidate <Switch onClick={()=>handleCandidateUpdate()} /> </span>
      </div>
    </nav>

    <form onSubmit={handleSubmit} className="p-4 max-w-lg pl-8 space-y-4 shadow pt-18 h-screen overflow-y-auto" style={{scrollbarWidth:"none"}}>
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" required />
      <input type="text" name="mobileNo" placeholder="Mobile No" value={formData.mobileNo} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" />
      <div className="flex gap-5 w-full p-2 border rounded border-slate-300">
        <label>Gender:</label>
        <label className="flex gap-2">
          <input
          type="radio"
          name="gender"
          value="male"
          onChange={handleInputChange}
          checked={formData.gender === "male"}
          />
          Male
        </label>

        <label className="flex gap-2">
          <input
          type="radio"
          name="gender"
          value="female"
          onChange={handleInputChange}
          checked={formData.gender === "female"}
          />
          Female
        </label>
      </div>

      <div className="flex gap-5 w-full p-2 border rounded border-slate-300">
      <label>Marital Status:</label>
        <label className="flex gap-2">
          <input
          type="radio"
          name="maritalStatus"
          value="married"
          onChange={handleInputChange}
          checked={formData.maritalStatus === "married"}
          />
          Married
          </label>

          <label className="flex gap-2">
          <input
          type="radio"
          name="maritalStatus"
          value="unmarried"
          onChange={handleInputChange}
          checked={formData.maritalStatus === "unmarried"}
          />
          Unmarried
        </label>  
      </div>

      <div className="flex gap-6 flex-col">
        <p className="text-slate-700 font-bold">Select Education</p>
      {
        Array.isArray(formData.education) && formData.education.length > 0 && formData.education.map((item)=>(
        <div key={item.id} className="flex flex-col gap-4 " >
        <input type="text" onChange={(e) => handleEducationChange(e, item.id, "universityName")} placeholder="university name" className="w-full p-2 border rounded border-slate-300"/>
        <select  onChange={(e) => handleEducationChange(e, item.id, "name")} className="w-full p-2 border rounded border-slate-300">
        <option value="">Select UG</option>
        {
        UG.map((ug, i)=>(
          <option key={i} value={ug.name}>{ug.name}</option>
        ))
        }
    </select>
      <select name="name" onChange={(e) => handleEducationChange(e, item.id, "name")} className="w-full p-2 border rounded border-slate-300">
      <option value="">Select PG</option>
      {
        PG.map((pg, i)=>(
          <option key={i} value={pg.name}>{pg.name}</option>
        ))
      }
    </select>
    <button type="button" onClick={()=>{ 
      removeEducationField(item.id)}}
      className="px-4 py-0.5 rounded bg-orange-500 text-white"
      >
        remove
      </button>
          </div>
        ))
      }
      <button type="button" onClick={(e)=>{ 
      addEducationField()}}
      className="px-4 py-0.5 rounded bg-cyan-500 text-white"
      >
        + Add More
      </button>
      </div>

      <select name="product" id="" onChange={handleChange} className="w-full p-2 border rounded border-slate-300">
        <option value="">select product</option>
        {
        Product.map((item, i)=>(
        <option key={i} value={item.name}>{item.name}</option>
        ))
      }
      </select>

      <input type="text" name="currentCompany" placeholder="current company" value={formData.currentCompany} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" />
      <input type="number" name="yearsOfExperience" placeholder="Years of Experience" value={formData.yearsOfExperience} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" />
      <select name="noticePeriod" onChange={handleChange} className="w-full p-2 border rounded border-slate-300">
        <option value="">select notice Period</option>
      {noticePeriodOptions.map((value, i)=>(
        <option key={i} value={value}>{value}</option>
      ))}
      </select>
      <input type="text" name="currentCtc" placeholder="Current CTC" value={formData.currentCtc} onChange={handleChange} className="w-full p-2 border rounded border-slate-300" required />
      
      {/* <input type="text" name="maritalStatus" placeholder="Marital Status" value={formData.maritalStatus} onChange={handleChange} className="w-full p-2 border rounded" /> */}
      
      {/* Work Experience */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">Work Experience</h3>
        {formData.workExperience.map((exp, index) => (
          <div key={index} className="space-y-2">
            <input type="text" placeholder="Company Name" value={exp.name} onChange={(e) => handleArrayChange(index, "name", e.target.value, "workExperience")} className="w-full p-2 border rounded border-slate-300" />
            <input type="text" placeholder="Designation" value={exp.designation} onChange={(e) => handleArrayChange(index, "designation", e.target.value, "workExperience")} className="w-full p-2 border rounded border-slate-300" />
            <textarea placeholder="Description" value={exp.description} onChange={(e) => handleArrayChange(index, "description", e.target.value, "workExperience")} className="w-full p-2 border rounded border-slate-300"></textarea>
            <DateSelector selectDate={(startDate, endDate) => handleSelectDates(startDate, endDate, index)}/>
            <button type="button" onClick={() => removeArrayField("workExperience", index)} className="bg-red-500 text-white p-2 rounded">Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("workExperience", { name: "", designation: "", description: "", startDate:"", endDate:"", })} className="bg-blue-500 text-white p-2 rounded">Add Experience</button>
      </div>

      {/* User Location */}
      <div className="flex flex-col gap-4">
        <h3 className="font-semibold">User Location</h3>
        <input type="text" name="country" placeholder="country" value={formData.userLocation.country} onChange={handleLocation} className="w-full p-2 border rounded border-slate-300" />
        <input type="text" name="state" placeholder="state" value={formData.userLocation.state} onChange={handleLocation} className="w-full p-2 border rounded border-slate-300" />
        <input type="text" name="city" placeholder="city" value={formData.userLocation.city} onChange={handleLocation} className="w-full p-2 border rounded border-slate-300" />
      </div>

      <div className="flex flex-col gap-4">
  <label className="text-sm font-medium">Skills</label>
  <input
    type="text"
    value={skillInput}
    onChange={(e) => setSkillInput(e.target.value)}
    onKeyDown={handleAddSkill}
    placeholder="Type a skill and press Enter or Comma"
    className="border border-gray-300 p-2 rounded-md"
  />

  {/* Display Skills */}
  <div className="flex flex-wrap gap-2">
    {Array.isArray(formData.skills) && formData.skills.map((skill, index) => (
      <div key={index} className="px-3 py-1 bg-blue-500 text-white rounded flex items-center">
        {skill}
        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-white font-bold cursor-pointer focus:outline-none">
          ×
        </button>
      </div>
    ))}
  </div>

  <div>
  <label className="cursor-pointer bg-gray-200 px-4 py-2 rounded-md text-gray-700 w-full text-center">
      {formData.cv.length>0 ? formData.cv.map((file) => file.name ) : <> upload resume <i className="ri-file-upload-fill"></i></>}
      <input
        type="file"
        onChange={handleFileChange}
        className="hidden" // Hide default file input
      />
    </label>
      </div>
</div>


      {/* Submit Button */}
      <button type="submit" onClick={handleUpload} className="bg-green-500 text-white p-2 rounded w-full mt-4 mb-4 cursor-pointer">Create Candidate</button>
    </form>


    <div className={`${isCandidateUpdate?" w-[60%] pt-16 max-lg:w-xl  px-8" : "hidden"}`}>
    <div className="flex flex-col gap-4">
      <span className="text-slate-600 font-bold tracking-wider">Find candidate to update</span>
      <input type="text" value={findCandidatedInput} onChange={(e) => setfindCandidatedInput(e.target.value)} placeholder="find candidate" className="border border-slate-300 rounded py-1 px-2 focus:outline-gray-400"/>
    </div>
    <div className={`${isCandidateSelect? "hidden" : "flex flex-col gap-2 h-[75vh] overflow-y-auto pb-10 mt-4"}`} style={{scrollbarWidth:"none"}}>
    {
      Array.isArray(filterCandidates) && filterCandidates.length>0 && filterCandidates.map((user)=>(
      <div key={user._id} onClick={()=> handleSelectUpdateCandidate(user)} className="flex flex-col gap-2 shadow">
      <div className="w-full border border-slate-300 cursor-pointer bg-gray-200 gap-4 flex justify-between rounded px-2 py-1 items-center">
        <div className="flex flex-col">
        <span className="text-slate-600 font-semibold">{user.fullName}</span>
        <span className="text-sm text-slate-600">{user.email}</span>
        </div>
        <div className="flex flex-col">
        <span className="text-sm text-slate-600">
          {user?.mobileNo ?? user?.["mobile number"] ?? ""}
        </span>

          <span className="text-sm font-semibold text-slate-600">{user.workExperience? user.workExperience[0]?.name : "Not provided"}</span>
        </div>
        <div  className="h-8 w-8 rounded-full hover:bg-gray-300 cursor-pointer hover:text-red-500 flex items-center justify-center">
        <i className="ri-close-line"></i>
        </div>
      </div>

    </div>
      ))
    }
    </div>


    {
      selectedCandidate && selectedCandidate.map((user)=>(
        <div key={user._id} className="flex flex-col gap-2 mt-4">
      <div className="w-full border border-slate-300 cursor-pointer bg-gray-200 flex justify-between rounded px-2 py-1 items-center">
        <div className="flex flex-col">
        <span className="text-slate-600 font-semibold">{user.fullName}</span>
        <span className="text-sm text-slate-600">{user.email}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-slate-600">{user.mobileNo? user.mobileNo: user["mobile number"]? user["mobiler number"] : "Not available"}</span>
          <span className="text-sm text-slate-600">{user.workExperience? user.workExperience[0]?.name : "Not provided"}</span>
        </div>
        <div onClick={()=>handleRemoveSelectedCandidate()} className="h-8 w-8 rounded-full hover:bg-gray-300 cursor-pointer hover:text-red-500 flex items-center justify-center">
        <i className="ri-close-line"></i>
        </div>
      </div>

    </div>
      ))
    }

    </div>
    {Loading && (
    <div className="w-full h-screen flex items-center justify-center absolute top-0 left-0">
      <PuffLoader/>
    </div> ) 
    }
    <div className="absolute bottom-10 left-[40%]">
      <div className={`${successMessage.length?"flex items-center justify-center py-1 px-4 rounded-2xl text-slate-700 bg-slate-200 border border-slate-400" :"hidden"}`}>{successMessage}</div>
    </div>
    </div>
    </>
  );
};

export default UserForm;
