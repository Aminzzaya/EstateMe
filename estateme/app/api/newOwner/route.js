import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Owner from "@/model/owner";

export async function POST(req) {
  try {
    const { firstName, lastName, phoneNumber, ownerRegNo, gender, email } =
      await req.json();

    await connectMongo();
    await Owner.create({
      firstName,
      lastName,
      phoneNumber,
      ownerRegNo,
      gender,
      email,
    });

    return NextResponse.json(
      { message: "Эзэмшигч амжилттай бүртгэлээ" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Алдаа: Эзэмшигч бүртгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
