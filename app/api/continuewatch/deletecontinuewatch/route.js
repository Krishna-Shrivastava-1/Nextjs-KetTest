import { database } from "@/lib/dbConnect";
import { userModel } from "@/Models/User";
import { NextResponse } from "next/server";

export async function DELETE(req) {
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

        // Check if the movie exists in the list
        if (user.continuewatching.includes(id)) {
            user.continuewatching.pull(id); // Remove the movie from the list
            await user.save(); // Save changes
            console.log(`✅ Movie ${id} removed from continue watching list`);
        } else {
            return NextResponse.json({ message: "Movie not found in user's list", success: false }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Deleted from continue watching', 
            success: true, 
            continuewatching: user.continuewatching 
        }, { status: 200 });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return NextResponse.json({ message: 'Server error', success: false }, { status: 500 });
    }
}
