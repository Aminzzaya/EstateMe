import mongoose from "mongoose";

const Schema = mongoose.Schema;

const currencySchema = new Schema(
  {
    currencyId: {
      type: String,
      required: true,
    },
    currencyName: {
      type: String,
      required: true,
    },
}
);

const Currency =
  mongoose.models.Currency || mongoose.model("Currency", currencySchema);

export default Currency;
