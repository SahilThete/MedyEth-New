const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const patientSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },
  LastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Age: {
    type: String,
    required: true,
  },
  Weight: {
    type: String,
    required: true,
  },
  blockchainAddress: {
    
        type: String,
        required: true,
    
    },
  DoctorRequests: [{
    doctorName: String,
    doctorBlockchainAddress: String,
    hospitalAddress: String,
    requestedAt: { type: Date, default: Date.now }
  }],

});

patientSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;