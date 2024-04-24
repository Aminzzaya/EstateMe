import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";
import Employees from "@/model/employees";

export async function POST(req) {
  try {
    const { employeeId } = await req.json();

    await connectMongo();

    let properties = [];

    const employee = await Employees.findOne({ employeeId });

    if (employee) {
      let pipeline = [
        {
          $lookup: {
            from: "propertyType",
            localField: "typeId",
            foreignField: "typeId",
            as: "typeName",
          },
        },
        {
          $unwind: "$typeName",
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
          $lookup: {
            from: "owners",
            localField: "ownerRegNo",
            foreignField: "ownerRegNo",
            as: "owner",
          },
        },
        {
          $unwind: "$owner",
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
            email: "$owner.email",
            firstName: "$owner.firstName",
            lastName: "$owner.lastName",
            gender: "$owner.gender",
            phoneNumber: "$owner.phoneNumber",
            ownerName: {
              $concat: [
                "$owner.firstName",
                " ",
                { $substrCP: ["$owner.lastName", 0, 1] },
                ".",
              ],
            },
          },
        },
        {
          $project: {
            cityName: 0,
            districtName: 0,
            streetName: 0,
            owner: 0,
          },
        },
      ];

      if (employee.employeeType === 3) {
        pipeline.push({
          $match: {
            employeeId: employee.employeeId,
          },
        });
      }
      properties = await Property.aggregate(pipeline);
    }

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
