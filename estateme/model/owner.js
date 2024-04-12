import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ownerSchema = new Schema(
  {
    ownerId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    registerNumber: {
        type: String,
        required: true,
    },
    gender: {
        type: Number,
        required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Owner =
  mongoose.models.Owner || mongoose.model("Owner", ownerSchema);

export default Owner;
