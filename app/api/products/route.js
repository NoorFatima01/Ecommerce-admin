// import clientPromise from "@/lib/mongodb";
import connectDB from "@/lib/mongoose";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await connectDB();
    const { title, description, price,images,category,properties } = await req.json();
    console.log("data: "+ title+description);
      const productDoc = await Product.create({
        title,
        description,
        price,
        images,
        category,
        properties,

      });
      return NextResponse.json(productDoc, { status: 200 })
  } catch (error) {
    console.log("error:" + error);
    return NextResponse.error(error);
  }
}

export async function GET(req, res) {
  try{
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products, { status: 200 });
  }
  catch(error){
    console.log("error:" + error);
    return NextResponse.error(error);
  }
}




