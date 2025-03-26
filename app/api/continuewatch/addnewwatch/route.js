import { database } from "@/lib/dbConnect"
import { userModel } from "@/Models/User"
import { NextResponse } from "next/server"



export async function POST(req) {
    try {
        await database();
        
        // Extract userId and movieId from request body
        const { id, userId } = await req.json();
        if (!id || !userId) {
            return NextResponse.json({ message: 'User ID or Movie ID missing', success: false }, { status: 400 });
        }

        // Find the user
        const user = await userModel.findById(userId);
        if (!user) {
            return NextResponse.json({ message: 'User not found', success: false }, { status: 404 });
        }

        // Ensure continuewatching exists
        if (!user.continuewatching) {
            user.continuewatching = [];
        }

        // Only push if the movie is not already in the list
        if (!user.continuewatching.includes(id)) {
            user.continuewatching.push(id);
            await user.save();
            // console.log("Movie added, updated list:", user.continuewatching);
        } else {
            console.log("Movie already in continue watching list.");
        }

        return NextResponse.json({ 
            message: 'Updated continue watching', 
            success: true, 
            continuewatching: user.continuewatching 
        }, { status: 200 });

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({ message: 'Server error', success: false }, { status: 500 });
    }
}