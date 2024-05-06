import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Notifications from "@/model/notifications";

export async function POST(req) {
  try {
    const { notificationId } = await req.json();

    await connectMongo();

    const updatedNotification = await Notifications.findByIdAndUpdate(
      notificationId,
      { status: 1 },
      { new: true }
    );

    if (!updatedNotification) {
      return NextResponse.json(
        { message: "Мэдэгдэл олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Мэдэгдлийн төлөв амжилттай шинэчлэгдлээ.",
        updatedNotification,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа.", error);
    return NextResponse.json(
      { message: "Мэдэгдлийн төлөв шинэчлэхэд алдаа гарлаа." },
      { status: 500 }
    );
  }
}
