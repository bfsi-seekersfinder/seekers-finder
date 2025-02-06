import { useState, useMemo } from "react";
import FilteredProfiles from "../searchview/FilteredProfiles";

const candidates = [
  {
    id: 1,
    name: "John Doe",
    jobProfile: "Software Engineer",
    keywords: ["React", "Node.js", "MongoDB"],
    experience: 3,
    location: "New York",
    category: "IT",
    jobType: "Full-Time",
    age: 28,
  },
  {
    id: 2,
    name: "Jane Smith",
    jobProfile: "Data Scientist",
    keywords: ["Python", "Machine Learning", "AI"],
    experience: 5,
    location: "San Francisco",
    category: "Data Science",
    jobType: "Remote",
    age: 30,
  },
  {
    id: 3,
    name: "Mike Johnson",
    jobProfile: "Graphic Designer",
    keywords: ["Photoshop", "Illustrator", "UI/UX"],
    experience: 2,
    location: "Los Angeles",
    category: "Design",
    jobType: "Part-Time",
    age: 26,
  },
];

export default function CandidateSearch() {
  const [filters, setFilters] = useState({
    jobProfile: "",
    keywords: "",
    experience: "",
    location: "",
    category: "",
    jobType: "",
    ageLimit: "",
  });

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Use useMemo to avoid unnecessary recalculations
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      return (
        (filters.jobProfile === "" || candidate.jobProfile.toLowerCase().includes(filters.jobProfile.toLowerCase())) &&
        (filters.keywords === "" || candidate.keywords.some((kw) => kw.toLowerCase().includes(filters.keywords.toLowerCase()))) &&
        (filters.experience === "" || candidate.experience >= Number(filters.experience)) &&
        (filters.location === "" || candidate.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.category === "" || candidate.category.toLowerCase().includes(filters.category.toLowerCase())) &&
        (filters.jobType === "" || candidate.jobType.toLowerCase().includes(filters.jobType.toLowerCase())) &&
        (filters.ageLimit === "" || candidate.age <= Number(filters.ageLimit))
      );
    });
  }, [filters]);

  return (
    <>
      <div className="min-h-screen bg-white p-6 pt-18">
        <div className="max-w-4xl mx-auto bg-slate-100 rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold tracking-wider text-center text-blue-600">Candidate Search</h2>
          <div className="flex flex-col gap-4 mt-4">
            {["jobProfile", "keywords"].map((field) => (
              <input
                key={field}
                type="text" // ✅ Fix: Always use "text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={filters[field]}
                onChange={handleChange}
                className="p-2 border-gray-300 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            ))}
          </div>
          <h3 className="text-xl font-semibold mt-6 text-gray-700">Filtered Candidates</h3>
          {/* ✅ Pass as a prop, not a function */}
        </div>
      </div>
    </>
  );
}
