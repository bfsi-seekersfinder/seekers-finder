import mongoose from 'mongoose'

const candidateSchema = new mongoose.Schema({
  FullName: {
    type: String,
    required: true
  },
  EmailAddress: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address']
  },
  PhoneNumber: {
    type: String,
    required: true,
    unique: true
  },
  Gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  DateOfBirth: {
    type: Date,
    required: true
  },
  Address: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true
  },
  State: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true
  },
  CurrentCompany: {
    type: String,
    required: true
  },
  CurrentDesignation: {
    type: String,
    required: true
  },
  CurrentProduct: {
    type: String,
    required: true
  },
  Experience: {
    type: String, // You can parse this to store as numbers, but this format can work if you want to keep it flexible
    required: true
  },
  PastCompanies: [{
    CompanyName: {
      type: String
    },
    Designation: {
      type: String
    },
    Product: {
      type: String
    }
  }],
  HighestDegree: {
    type: String,
    required: true
  },
  UniversityInstitution: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Candidate = mongoose.model('users', candidateSchema);

export default Candidate;
