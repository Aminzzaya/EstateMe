import mongoose from "mongoose";

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
      required: true,
    },
    registrationDate: {
        type: Date,
        required: true,
    },
    typeId: {
        type: String,
        required: true,
    },
    statusId: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    certificate: {
        type: String,
        required: true,
    },
    zipCode: {
        type: Number,
        required: true,
    },
    locationId: {
        type: String,
        required: true,
    },
    buildingName: {
        type: String,
        required: true,
    },
    buildingTotalFloor: {
        type: Number,
        required: true,
    },
    apartmentName: {
        type: String,
        required: true,
    },
    apartmentFloor: {
        type: Number,
        required: true,
    },
    buildingMaterial: {
        type: String,
    },
    buildingNumOfCCTV: {
        type: Number,
    },
    commencementDate: {
        type: Date,
    },
    launchDate: {
        type: Date,
    },
    currencyId: {
        type: String,
        required: true,
    },
    currencyRate: {
        type: Number,
        required: true,
    },
    unitMaxPrice: {
        type: Number,
        required: true,
    },
    totalMaxPrice: {
        type: Number,
        required: true,
    },
    unitMinPrice: {
        type: Number,
        required: true,
    },
    totalMinPrice: {
        type: Number,
        required: true,
    },
    unitAvgPrice: {
        type: Number,
        required: true,
    },
    totalAvgPrice: {
        type: Number,
        required: true,
    },
    ceilingHeight: {
        type: Number,
        required: true,
    },
    baseArea: {
        type: Number,
        required: true,
    },
    numOfRoom: {
        type: Number,
        required: true,
    },
    numOfBedroom: {
        type: Number,
        required: true,
    },
    numOfBathroom: {
        type: Number,
        required: true,
    },
    numOfGarage: {
        type: Number,
    },
    garagePrice: {
        type: Number,
    },
    numOfEntry: {
        type: Number,
        required: true,
    },
    numOfExit: {
        type: Number,
        required: true,
    },
    numOfWindow: {
        type: Number,
        required: true,
    },
    isCentralWaterSupplies: {
        type: Boolean,
        required: true,
    },
    isLobby: {
        type: Boolean,
        required: true,
    },
    isAdditionalPowerSupplies: {
        type: Boolean,
        required: true,
    },
    isParkingLot: {
        type: Boolean,
        required: true,
    },
    isEmergencyExit: {
        type: Boolean,
        required: true,
    },
    earthquakeResistance: {
        type: String, 
    },
    distanceToDowntown: {
        type: Number,
    },
    distanceToSchool: {
        type: Number,
    },
    distanceToUniversity: {
        type: Number,
    },
    distanceToKindergarten: {
        type: Number,
    },
    pics: {
        type: String,
        required: true,
    },
    otherInfo: {
        type: String,
    },
  },
  { timestamps: true }
);

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;
