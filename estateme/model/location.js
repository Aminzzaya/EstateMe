import mongoose from "mongoose";

const Schema = mongoose.Schema;

const locationSchema = new Schema(
  {
    locationId: {
      type: Number,
      required: true,
    },
    regionId: {
        type: Number,
        required: true,
    },
    cityId: {
        type: Number,
        required: true,
    },
    districtId: {
        type: Number,
        required: true,
    },
    streetId: {
        type: Number,
        required: true,
    },        
}
);

const Location =
  mongoose.models.Location || mongoose.model("Location", locationSchema);

export default Location;
