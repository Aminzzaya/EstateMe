import mongoose from "mongoose";

const Schema = mongoose.Schema;

const purposeTypeSchema = new Schema(
  {
    purpose: {
      type: Number,
      required: true,
    },
    purposeName: {
      type: String,
      required: true,
    },
}
);

const PurposeType =
  mongoose.models.PurposeType || mongoose.model("PurposeType", purposeTypeSchema);

export default PurposeType;