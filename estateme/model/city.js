import mongoose from "mongoose";

const Schema = mongoose.Schema;

const citySchema = new Schema(
  {
    regionId: {
        type: Number,
        required: true,
    },
    cityId: {
        type: Number,
        required: true,
    },
    cityName: {
        type: String,
        required: true,
    },        
}
);

const City =
  mongoose.models.City || mongoose.model("City", citySchema);

export default City;
