// app/api/banners/get/route.js (GET /api/banners/get)
import { database } from '@/lib/dbConnect';
import { bannerModel } from '@/Models/HomeBanner';
import { NextResponse } from 'next/server';


export async function GET() {
  try {
    await database();
    const getimbann = await bannerModel.find();

    if (!getimbann || getimbann.length === 0) {
      return NextResponse.json({ message: 'No banner available', success: false }, { status: 401 });
    }

    return NextResponse.json({ banner: getimbann }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}