import mongoose from "mongoose";

const Schema = mongoose.Schema;

const districtSchema = new Schema(
  {
    cityId: {
        type: String,
        required: true,
    },
    districtId: {
        type: String,
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
