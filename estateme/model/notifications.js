import mongoose from "mongoose";

const Schema = mongoose.Schema;

const notificationsSchema = new Schema(
  {
    recipients: [
      {
        type: String,
      },
    ],
    type: {
      type: String,
    },
    sender: {
      type: String,
    },
    propertyId: {
      type: String,
    },
    status: {
      type: Number,
    },
    body: {
      type: String,
    },
  },
  { timestamps: true }
);

const Notifications =
  mongoose.models.Notifications ||
  mongoose.model("Notifications", notificationsSchema);

export default Notifications;
