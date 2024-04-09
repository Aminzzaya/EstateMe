import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const {
      employeeId,
      employeeType,
      password,
      firstName,
      email,
      lastName,
      phoneNumber,
    } = await req.json();

    await connectMongo();
    await Employees.create({
      employeeId,
      employeeType,
      password,
      firstName,
      lastName,
      phoneNumber,
      email,
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
