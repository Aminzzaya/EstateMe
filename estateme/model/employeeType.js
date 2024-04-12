import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeTypeSchema = new Schema(
  {
    employeeType: {
      type: Number,
      required: true,
    },
    employeeTypeName: {
      type: String,
      required: true,
    },
}
);

const EmployeeType =
  mongoose.models.EmployeeType || mongoose.model("EmployeeType", employeeTypeSchema);

export default EmployeeType;
