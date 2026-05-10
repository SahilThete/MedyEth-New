const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const doctorSchema = new mongoose.Schema({
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
  DateOfBirth: {
    type: String,
    required: true,
  },
  Gender: {
    type: String,
    required: true,
  },
  Specialization: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  blockchainAddress: {
    type: String,
    required: true,
},
});

doctorSchema.methods.verifyPassword = async function (password) {
  const doctor = this;
  const isMatch = await bcrypt.compare(password, doctor.password);
  return isMatch;
};

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
