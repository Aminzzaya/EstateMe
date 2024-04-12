import mongoose from "mongoose";

const Schema = mongoose.Schema;

const streetSchema = new Schema(
  {
    districtId: {
        type: String,
        required: true,
    },
    streetId: {
        type: String,
        required: true,
    },
    streetName: {
        type: String,
        required: true,
    },        
}
);

const Street =
  mongoose.models.Street || mongoose.model("Street", streetSchema);

export default Street;
