import { NextResponse } from 'next/server';
import { userModel } from '@/Models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { database } from '@/lib/dbConnect';

const secretkey = process.env.SecretKey || 'sdbmshfhfhbksbcaesikfolhfl';

export async function POST(req) {
  try {
    await database();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Fill All Fields', success: false },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: 'User not found', success: false },
        { status: 409 }
      );
    }

    const ispasswordcorrect = await bcryptjs.compare(password, user.password);
    if (!ispasswordcorrect) {
      return NextResponse.json(
        { message: 'Invalid Credentials', success: false },
        { status: 400 }
      );
    }

    const token = jwt.sign({ id: user._id }, secretkey, { expiresIn: '1d' });

    if (email === 'hell@gmail.com' && ispasswordcorrect) {
      return NextResponse.json({
        token: token,
        message: `Logged in Successfully Mr Owner ${user.name}`,
        success: true,
        owner: true,
      });
    } else {
      return NextResponse.json({
        token: token,
        message: `Logged in Successfully ${user.name}`,
        success: true,
        owner: false,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'User failed to login', success: false },
      { status: 500 }
    );
  }
}