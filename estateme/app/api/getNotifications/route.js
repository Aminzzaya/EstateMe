import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Notifications from "@/model/notifications";

export async function POST(req) {
  try {
    const { employeeId } = await req.json();

    await connectMongo();

    const notifications = await Notifications.aggregate([
      {
        $match: {
          recipients: employeeId,
          status: 0,
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "sender",
          foreignField: "employeeId",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $addFields: {
          employee: {
            $concat: [
              "$employee.firstName",
              " ",
              { $substrCP: ["$employee.lastName", 0, 1] },
              ".",
            ],
          },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return NextResponse.json(
      { message: "Амжилттай.", notifications },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Мэдэгдлүүд буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
