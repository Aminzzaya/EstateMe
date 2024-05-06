import connectMongo from "@/server/mongodb"; // MongoDB-тэй холбогдох функцийг импортлох
import { NextResponse } from "next/server";
import Property from "@/model/property";
import Notifications from "@/model/notifications";

export async function POST(req) {
  try {
    const {         // Үл хөдлөх хөрөнгийн мэдээллийг авах
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
      usage,
      pics,
      otherInfo,
    } = await req.json();

    await connectMongo();       // MongoDB-тэй холбогдох

    await Property.create({     // Шинэ үл хөдлөх хөрөнгийн мэдээллийг үүсгэх
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
      usage,
      pics,
      otherInfo,
    });

    const notification = new Notifications({
      recipients: ["ADMIN", employeeId],
      type: "Шинээр бүртгэсэн",
      sender: employeeId,
      propertyId,
      status: 0,
      body: `${propertyId} дугаартай үл хөдлөх хөрөнгө шинээр бүртгэгдлээ.`,
    });

    await notification.save();

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
