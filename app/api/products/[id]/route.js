import connectDB from "@/lib/mongoose";
import Product from "@/models/product";
import { NextResponse } from "next/server";


export async function GET(req, {params}) {
  try{
    await connectDB();
   const id = params.id;
    console.log("This is the id:", JSON.stringify(id, null, 2));
    const product = await Product.findOne({_id: id});
    console.log("This is the product:", JSON.stringify(product, null, 2));
    return NextResponse.json(product, { status: 200 });
  }
  catch(error){
    console.log("error:" + error);
    return NextResponse.error(error);
  }
}

export async function PUT(req, res) {
    try{
      await connectDB();
      const { title, description, price,images,_id} = await req.json();
      console.log("data: "+ title+description);
      const productDoc = await Product.updateOne(
        { _id },
        {
          $set: {
            title,
            description,
            price,
            images,
          },
        }
      );
      return NextResponse.json(productDoc, { status: 200 });
    }
    catch(error){
      console.log("error:" + error);
      return NextResponse.error(error);
    }
  }

export async function DELETE(req, {params}) {
try{
    await connectDB();
    const id = params.id;
    const product = await Product.deleteOne({_id: id});
    return NextResponse.json(product, { status: 200 });
} catch{
    console.log("error:" + error);
    return NextResponse.error(error);
}
}