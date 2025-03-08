// import mongoose from 'mongoose'

// const candidateSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
//   },
//   mobileNo: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   gender: {
//     type: String,
//     required: true
//   },
//   dob: {
//     type: Date,
//     required: true
//   },
//   userLocation: {
//     Type:String,
//   },
//   langugage: {
//     Type:String,
//   },
//   MartialStatus: {
//     type: String,
//     required: true
//   },
//   CurrentCompany: {
//     type: String,
//     required: true
//   },
//   CurrentDesignation: {
//     type: String,
//     required: true
//   },
//   CurrentProduct: {
//     type: String,
//     required: true
//   },
//   workExperience: {
//     type: String, 
//     required: true
//   },
//   skills: {
//     type: String, 
//     required: true
//   },
//   resume: {
//     type: String, 
//     required: true
//   },
//   profilePicture: {
//     type: String, 
//     required: true
//   },
//   noticePeriod: {
//     type: String, 
//     required: true
//   },
//   currentCtc: {
//     type: String, 
//     required: true
//   },
//   PastCompanies: [{
//     CompanyName: {
//       type: String
//     },
//     Designation: {
//       type: String
//     },
//     Product: {
//       type: String
//     }
//   }],
//   HighestDegree: {
//     type: String,
//     required: true
//   },
//   UniversityInstitution: {
//     type: String,
//     required: true
//   }
// }, { timestamps: true });

// const Candidate = mongoose.model('candidates', candidateSchema, "Candidates");

// export default Candidate;
