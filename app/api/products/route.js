// import clientPromise from "@/lib/mongodb";
import connectDB from "@/lib/mongoose";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await connectDB();
    const { title, description, price } = await req.json();
    console.log("data: "+ title+description);
      const productDoc = await Product.create({
        title,
        description,
        price,
      });
      return NextResponse.json(productDoc, { status: 200 })
  } catch (error) {
    console.log("error:" + error);
    return NextResponse.error(error);
  }
}



