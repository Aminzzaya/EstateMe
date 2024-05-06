import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";
import Notifications from "@/model/notifications";

export async function POST(req) {
  try {
    const { propertyId, employeeId } = await req.json();

    await connectMongo();

    const deletedProperty = await Property.findOneAndDelete({ propertyId });

    const notification = new Notifications({
      recipients: ["ADMIN", employeeId],
      type: "Устгасан",
      sender: employeeId,
      propertyId,
      status: 0,
      body: `${propertyId} дугаартай үл хөдлөх хөрөнгө устгагдлаа.`,
    });

    await notification.save();

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
