import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";

export async function POST(req) {
  try {
    const {
      propertyId,
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
