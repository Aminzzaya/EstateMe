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
    typeId: {
      type: Number,
      required: true,
    },
    statusId: {
      type: Number,
      required: true,
    },
    ownerRegNo: {
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
    buildingName: {
      type: String,
    },
    buildingTotalFloor: {
      type: Number,
    },
    apartmentFloor: {
      type: Number,
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
    },
    baseArea: {
      type: Number,
      required: true,
    },
    numOfRoom: {
      type: Number,
    },
    numOfBedroom: {
      type: Number,
    },
    numOfBathroom: {
      type: Number,
    },
    numOfGarage: {
      type: Number,
    },
    garagePrice: {
      type: Number,
    },
    numOfEntry: {
      type: Number,
    },
    numOfExit: {
      type: Number,
    },
    numOfWindow: {
      type: Number,
    },
    isCentralWaterSupplies: {
      type: Boolean,
    },
    isLobby: {
      type: Boolean,
    },
    isAdditionalPowerSupplies: {
      type: Boolean,
      required: true,
    },
    isParkingLot: {
      type: Boolean,
    },
    isEmergencyExit: {
      type: Boolean,
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
    purpose: {
      type: String,
    },
    pics: [
      {
        type: String,
      },
    ],
    otherInfo: {
      type: String,
    },
  },
  { timestamps: true }
);

const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);

export default Property;
