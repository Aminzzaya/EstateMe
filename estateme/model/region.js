import mongoose from "mongoose";

const Schema = mongoose.Schema;

const regionSchema = new Schema(
  {
    regionId: {
        type: Number,
        required: true,
    },
    regionName: {
        type: String,
        required: true,
    },      
}
);

const Region =
  mongoose.models.Region || mongoose.model("Region", regionSchema);

export default Region;
