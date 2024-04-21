import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const { email } = await req.json();

    await connectMongo();

    const user = await Employees.aggregate([
      {
        $match: {
          email,
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
          password: 1,
        },
      },
      { $unwind: "$employeeTypeName" },
    ]);

    if (!user) {
      return NextResponse.json(
        { message: "Хэрэглэгч олдсонгүй." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Хэрэглэгчийн мэдээлэл олдсон.", user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Хэрэглэгчийн мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
