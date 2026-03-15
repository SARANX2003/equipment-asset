import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import { NextResponse } from "next/server";

export async function DELETE(req,{params}){

  await dbConnect();

  await Borrow.findByIdAndDelete(params.id);

  return NextResponse.json({
    message:"deleted"
  });

}