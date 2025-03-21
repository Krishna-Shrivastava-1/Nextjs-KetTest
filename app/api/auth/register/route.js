import { NextResponse } from 'next/server';
import { userModel } from '@/Models/User'; // Adjust import path
import bcryptjs from 'bcryptjs';
import { database } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    const { name, email, password } = await req.json(); // Use req.json() to parse body
    await database();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Fill All Fields', success: false },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format', success: false },
        { status: 400 }
      );
    }

    const existuser = await userModel.findOne({ email });
    if (existuser) {
      return NextResponse.json(
        { message: 'User Already Exist', success: false },
        { status: 409 }
      );
    }

    const hashpassword = await bcryptjs.hash(password, 10);
    const newuser = new userModel({ name, email, password: hashpassword });
    await newuser.save();

    return NextResponse.json(
      { message: 'User Created Successfully', success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Registration failed', success: false },
      { status: 500 }
    );
  }
}