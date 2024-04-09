import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    employeeId: {
      type: String,
      required: true,
    },
    employeeType: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Employees =
  mongoose.models.Employees || mongoose.model("Employees", employeeSchema);

export default Employees;
