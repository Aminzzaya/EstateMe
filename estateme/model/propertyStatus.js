import mongoose from "mongoose";

const Schema = mongoose.Schema;

const propertyStatusSchema = new Schema(
  {
    statusId: {
      type: Number,
      required: true,
    },
    statusName: {
      type: String,
      required: true,
    },
}
);

const PropertyStatus =
  mongoose.models.PropertyStatus || mongoose.model("PropertyStatus", propertyStatusSchema);

export default PropertyStatus;
