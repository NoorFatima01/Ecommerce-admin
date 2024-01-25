import connectDB from "@/lib/mongoose";
import Category from "@/models/category";
import { NextResponse } from "next/server";


export async function PUT(req, res){
try{
    await connectDB();
    const { name, parent, id,properties } = await req.json();
    const categoryDoc = await Category.updateOne(
        { _id:id },
        {
          $set: {
            name,
            parent:parent===''?undefined:parent,
            properties,
          },
        }
      );
      return NextResponse.json(categoryDoc, { status: 200 });
} catch(error){
    console.log("error:" + error);
    return NextResponse.error(error);
}
}

export async function DELETE(req, {params}){
try{
    await connectDB();
    const id = params.id;
    const category = await Category.deleteOne({_id: id});
    return NextResponse.json(category, { status: 200 });
} catch{
    console.log("error:" + error);
    return NextResponse.error(error);
}
}