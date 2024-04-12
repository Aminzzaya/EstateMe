import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function GET() {
  try {
    await connectMongo();

    const allEmployees = await Employees.find({
      employeeType: { $ne: 0 },
    }).sort({
      status: -1,
      employeeType: 1,
    });

    return NextResponse.json(
      { message: "Бүх ажилчдын мэдээлэл олдлоо.", employees: allEmployees },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Ажилтнуудын мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
