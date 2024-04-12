import mongoose from "mongoose";

const Schema = mongoose.Schema;

const employeeTypeSchema = new Schema(
  {
    employeeTypeId: {
      type: String,
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
