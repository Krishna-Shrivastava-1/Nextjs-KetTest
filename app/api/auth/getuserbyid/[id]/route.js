// pages/api/users/[id].js
import { database } from "@/lib/dbConnect";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server";

export async function GET(req, context) {  
    const { params } = context;  // ✅ Correct way to access params in App Router
    const id = params.id;  

    try {
        await database();
        const finduser = await userModel.findById(id).select('-password');

        if (!finduser) {
            return NextResponse.json(
                { message: 'User not found', success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'User found', user: finduser },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
