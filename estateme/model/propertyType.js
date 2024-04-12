import mongoose from "mongoose";

const Schema = mongoose.Schema;

const propertyTypeSchema = new Schema(
  {
    typeId: {
      type: String,
      required: true,
    },
    typeName: {
      type: String,
      required: true,
    },
}
);

const PropertyType =
  mongoose.models.PropertyType || mongoose.model("PropertyType", propertyTypeSchema);

export default PropertyType;
