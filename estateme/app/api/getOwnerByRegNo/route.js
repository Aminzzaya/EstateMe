import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Owner from "@/model/owner";

export async function POST(req) {
  try {
    const { ownerRegNo } = await req.json();

    await connectMongo();

    const owner = await Owner.findOne({ ownerRegNo });

    if (!owner) {
      return NextResponse.json(
        { message: "Эзэмшигч олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Эзэмшигчийн мэдээлэл олдсон.", owner },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Эзэмшигчийн мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
