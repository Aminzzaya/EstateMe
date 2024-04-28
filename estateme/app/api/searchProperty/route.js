import connectMongo from "@/server/mongodb";
import { NextResponse } from "next/server";
import Property from "@/model/property";
import City from "@/model/city";
import District from "@/model/district";
import PropertyType from "@/model/propertyType";

export async function POST(req) {
  try {
    const {
      purpose,
      regionId,
      cityId,
      districtId,
      typeId,
      numOfRoom,
      distanceToDowntown,
      maxBaseArea,
      minBaseArea,
      maxTotalAvgPrice,
      minTotalAvgPrice,
    } = await req.json();

    await connectMongo();

    const query = {};

    if (purpose) query.purpose = purpose;
    if (regionId) query.regionId = regionId;
    if (cityId) query.cityId = cityId;
    if (districtId) query.districtId = districtId;
    if (typeId) query.typeId = typeId;

    if (numOfRoom) {
      query.numOfRoom = { $gte: numOfRoom };
    }
    if (distanceToDowntown) {
      query.distanceToDowntown = { $lte: distanceToDowntown };
    }

    if (minBaseArea || maxBaseArea) {
      query.baseArea = {};
      if (minBaseArea) query.baseArea.$gte = minBaseArea;
      if (maxBaseArea) query.baseArea.$lte = maxBaseArea;
    }

    if (minTotalAvgPrice || maxTotalAvgPrice) {
      query.totalAvgPrice = {};
      if (minTotalAvgPrice) query.totalAvgPrice.$gte = minTotalAvgPrice;
      if (maxTotalAvgPrice) query.totalAvgPrice.$lte = maxTotalAvgPrice;
    }

    Object.keys(query).forEach((key) =>
      query[key] === undefined || query[key] === null ? delete query[key] : {}
    );

    const filteredProperties = await Property.aggregate([
      { $match: query },
      { $match: { ...query, statusId: { $nin: [4, 6] } } },
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

    const cityName = await City.findOne({ cityId: cityId });
    const districtName = await District.findOne({ districtId: districtId });

    const filters = {
      purpose,
      regionId,
      cityId,
      cityName: cityName ? cityName.cityName : null,
      districtId,
      districtName: districtName ? districtName.districtName : null,
      typeId,
      numOfRoom,
      distanceToDowntown,
      maxBaseArea,
      minBaseArea,
      maxTotalAvgPrice,
      minTotalAvgPrice,
    };

    return NextResponse.json(
      { properties: filteredProperties, filters },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { message: "Error: Failed to search properties", error: error },
      { status: 500 }
    );
  }
}
