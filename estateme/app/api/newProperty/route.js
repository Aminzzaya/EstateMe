import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";

export async function POST(req) {
  try {
    const {
      propertyId,
      employeeId,
      typeId,
      statusId,
      ownerRegNo,
      certificate,
      zipCode,
      regionId,
      cityId,
      districtId,
      streetId,
      buildingName,
      buildingTotalFloor,
      apartmentFloor,
      buildingMaterial,
      buildingNumOfCCTV,
      commencementDate,
      launchDate,
      unitMaxPrice,
      totalMaxPrice,
      unitMinPrice,
      totalMinPrice,
      unitAvgPrice,
      totalAvgPrice,
      ceilingHeight,
      baseArea,
      numOfRoom,
      numOfBedroom,
      numOfBathroom,
      numOfGarage,
      garagePrice,
      numOfEntry,
      numOfExit,
      numOfWindow,
      isCentralWaterSupplies,
      isLobby,
      isAdditionalPowerSupplies,
      isParkingLot,
      isEmergencyExit,
      earthquakeResistance,
      distanceToDowntown,
      distanceToSchool,
      distanceToUniversity,
      distanceToKindergarten,
      purpose,
      pics,
      otherInfo,
    } = await req.json();

    await connectMongo();
    await Property.create({
      propertyId,
      employeeId,
      typeId,
      statusId,
      ownerRegNo,
      certificate,
      zipCode,
      regionId,
      cityId,
      districtId,
      streetId,
      buildingName,
      buildingTotalFloor,
      apartmentFloor,
      buildingMaterial,
      buildingNumOfCCTV,
      commencementDate,
      launchDate,
      unitMaxPrice,
      totalMaxPrice,
      unitMinPrice,
      totalMinPrice,
      unitAvgPrice,
      totalAvgPrice,
      ceilingHeight,
      baseArea,
      numOfRoom,
      numOfBedroom,
      numOfBathroom,
      numOfGarage,
      garagePrice,
      numOfEntry,
      numOfExit,
      numOfWindow,
      isCentralWaterSupplies,
      isLobby,
      isAdditionalPowerSupplies,
      isParkingLot,
      isEmergencyExit,
      earthquakeResistance,
      distanceToDowntown,
      distanceToSchool,
      distanceToUniversity,
      distanceToKindergarten,
      purpose,
      pics,
      otherInfo,
    });

    return NextResponse.json(
      { message: "Үл хөдлөх хөрөнгө амжилттай бүртгэлээ" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Алдаа: Үл хөдлөх хөрөнгө бүртгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
