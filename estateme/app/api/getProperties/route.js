import connectMongo from "@/server/mongodb";  // MongoDB-тэй холбогдох функцийг импортлох
import { NextResponse } from "next/server";
import Property from "@/model/property";

export async function GET() {
  try {
    await connectMongo();       // MongoDB-тэй холбогдох

    const properties = await Property.aggregate([
      {
        $lookup: {                    // Өгөгдлийг холбох (select, join)
          from: "propertyType",     
          localField: "typeId",
          foreignField: "typeId",
          as: "typeName",
        },
      },
      {
        $unwind: "$typeName",         // Талбар
      },
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "employeeId",
          as: "employee",
        },
      },
      {
        $unwind: "$employee",
      },
      {
        $lookup: {
          from: "propertyStatus",
          localField: "statusId",
          foreignField: "statusId",
          as: "statusName",
        },
      },
      {
        $unwind: "$statusName",
      },
      {
        $lookup: {
          from: "cities",
          localField: "cityId",
          foreignField: "cityId",
          as: "cityName",
        },
      },
      {
        $unwind: "$cityName",
      },
      {
        $lookup: {
          from: "districts",
          localField: "districtId",
          foreignField: "districtId",
          as: "districtName",
        },
      },
      {
        $unwind: "$districtName",
      },
      {
        $lookup: {
          from: "streets",
          localField: "streetId",
          foreignField: "streetId",
          as: "streetName",
        },
      },
      {
        $unwind: "$streetName",
      },
      {
        $addFields: {
          typeName: "$typeName.typeName",
          employee: {
            $concat: [
              "$employee.firstName",
              " ",
              { $substrCP: ["$employee.lastName", 0, 1] },
              ".",
            ],
          },
          statusName: "$statusName.statusName",
          address: {
            $concat: [
              "$cityName.cityName",
              ", ",
              "$districtName.districtName",
              ", ",
              "$streetName.streetName",
            ],
          },
        },
      },
      {
        $project: {
          cityName: 0,
          districtName: 0,
          streetName: 0,
        },
      },
    ]);

    return NextResponse.json(
      { message: "Амжилттай.", properties: properties },
      { status: 200 }
    );
  } catch (error) {
    console.error("Алдаа:", error);
    return NextResponse.json(
      { message: "Үл хөдлөх хөрөнгийн мэдээлэл буцаахад алдаа гарлаа." },
      { status: 500 }
    );
  }
}
