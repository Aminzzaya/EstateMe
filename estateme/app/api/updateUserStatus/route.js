import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const { employeeId, employeeType, email, phoneNumber, status } =
      await req.json();

    await connectMongo();

    const updatedEmployee = await Employees.findOneAndUpdate(
      { employeeId: employeeId },
      {
        employeeType,
        phoneNumber,
        email,
        status,
      },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { message: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Хэрэглэгчийн мэдээлэл амжилттай шинэчлэгдлээ." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Алдаа: Хэрэглэгчийн мэдээлэл шинэчлэхэд алдаа гарлаа:" },
      { status: 500 }
    );
  }
}
