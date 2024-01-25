import Category from "@/models/category";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";

export async function POST(req, res){
try{
    await connectDB();
    const { name, parent,properties } = await req.json();
        const categoryDoc = await Category.create({
        name,
        parent:parent===''?undefined:parent,
        properties,
        });
        return NextResponse.json(categoryDoc, { status: 200 })
}catch(error){
    console.log("error:" + error);
    return NextResponse.error(error);
}} 

export async function GET(req, res){
try{
    await connectDB();
    const categories = await Category.find({}).populate("parent");
    return NextResponse.json(categories, { status: 200 });
} catch(error){
    console.log("error:" + error);
    return NextResponse.error(error);
}
}