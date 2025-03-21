import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { database } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    await database();
    cookies().set('authtoken', '', {
      httpOnly: true,
      sameSite: 'strict', // Or 'lax'
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0), // Expire immediately
    });
    return NextResponse.json({
      message: 'User logged out successfully',
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'User failed to logout', success: false },
      { status: 500 }
    );
  }
}