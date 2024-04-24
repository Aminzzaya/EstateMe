import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";

export async function POST(req) {
  try {
    const { propertyId } = await req.json();

    await connectMongo();

    const deletedProperty = await Property.findOneAndDelete({ propertyId });

    if (!deletedProperty) {
      return NextResponse.json(
        { message: "Үл хөдлөх хөрөнгө олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Үл хөдлөх хөрөнгө амжилттай устгалаа" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Алдаа: Үл хөдлөх хөрөнгө устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}
