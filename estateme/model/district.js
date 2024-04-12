import mongoose from "mongoose";

const Schema = mongoose.Schema;

const districtSchema = new Schema(
  {
    cityId: {
        type: Number,
        required: true,
    },
    districtId: {
        type: Number,
        required: true,
    },
    districtName: {
        type: String,
        required: true,
    },        
}
);

const District =
  mongoose.models.District || mongoose.model("District", districtSchema);

export default District;
