import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Employees from "@/model/employees";
import Notifications from "@/model/notifications";

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

    const firstName = updatedEmployee.firstName;
    const lastName = updatedEmployee.lastName;

    const notification = new Notifications({
      recipients: ["ADMIN"],
      type: "Төлөв шинэчилсэн",
      sender: "ADMIN",
      status: 0,
      body: `${firstName} ${lastName.slice(
        0,
        1
      )}. ажилтны төлөв ${status} болж шинэчлэгдлээ.`,
    });

    await notification.save();

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
