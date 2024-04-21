import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function GET() {
  try {
    await connectMongo();

    const allEmployees = await Employees.aggregate([
      {
        $match: {
          employeeType: { $ne: 9 },
        },
      },
      {
        $sort: {
          status: -1,
          employeeType: 1,
        },
      },
      {
        $lookup: {
          from: "employeeType",
          localField: "employeeType",
          foreignField: "employeeType",
          as: "employeeTypeName",
        },
      },
      {
        $project: {
          _id: 1,
          employeeTypeName: "$employeeTypeName.employeeTypeName",
          firstName: 1,
          lastName: 1,
          phoneNumber: 1,
          profilePicture: 1,
          email: 1,
          status: 1,
          employeeType: 1,
          employeeId: 1,
        },
      },
      { $unwind: "$employeeTypeName" },
    ]);

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
