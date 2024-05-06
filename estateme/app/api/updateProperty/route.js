import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";
import Notifications from "@/model/notifications";
import PropertyStatus from "@/model/propertyStatus";

export async function POST(req) {
  try {
    const {
      propertyId,
      employeeId,
      statusId,
      unitAvgPrice,
      totalAvgPrice,
      unitMaxPrice,
      totalMaxPrice,
      unitMinPrice,
      totalMinPrice,
    } = await req.json();

    await connectMongo();

    const updatedProperty = await Property.findOneAndUpdate(
      { propertyId },
      {
        statusId,
        unitAvgPrice,
        totalAvgPrice,
        unitMaxPrice,
        totalMaxPrice,
        unitMinPrice,
        totalMinPrice,
      },
      { new: true }
    );

    const propertyWithStatus = await Property.aggregate([
      { $match: { propertyId: propertyId } },
      {
        $lookup: {
          from: "propertyStatus",
          localField: "statusId",
          foreignField: "statusId",
          as: "statusInfo",
        },
      },
      { $unwind: "$statusInfo" },
    ]);

    const statusName =
      propertyWithStatus.length > 0
        ? propertyWithStatus[0].statusInfo.statusName
        : "";

    const notification = new Notifications({
      recipients: ["ADMIN", employeeId],
      type: "Төлөв шинэчилсэн",
      sender: employeeId,
      propertyId,
      status: 0,
      body: `${propertyId} дугаартай үл хөдлөх хөрөнгийн төлөв ${statusName} болж шинэчлэгдлээ.`,
    });

    await notification.save();

    if (!updatedProperty) {
      return NextResponse.json(
        { message: "Үл хөдлөх хөрөнгө олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Үл хөдлөх хөрөнгө амжилттай шинэчлэгдлээ" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Алдаа: Үл хөдлөх хөрөнгө шинэчлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
