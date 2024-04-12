import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const {
      profilePicture,
      employeeId,
      employeeType,
      password,
      firstName,
      email,
      lastName,
      phoneNumber,
      status,
    } = await req.json();

    await connectMongo();
    await Employees.create({
      profilePicture,
      employeeId,
      employeeType,
      password,
      firstName,
      lastName,
      phoneNumber,
      email,
      status,
    });

    return NextResponse.json(
      { message: "Хэрэглэгч амжилттай бүртгэлээ" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering employee:", error);
    return NextResponse.json(
      { message: "Алдаа: Хэрэглэгчийг бүртгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}
