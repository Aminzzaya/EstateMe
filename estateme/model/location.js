import mongoose from "mongoose";

const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    locationId: {
      type: String,
      required: true,
    },
    regionId: {
        type: String,
        required: true,
    },
    cityId: {
        type: String,
        required: true,
    },
    districtId: {
        type: String,
        required: true,
    },
    streetId: {
        type: String,
        required: true,
    },        
}
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
