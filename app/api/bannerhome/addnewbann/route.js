// app/api/banners/add/route.js (POST /api/banners/add)
import { NextResponse } from 'next/server';


import { bannerModel } from '@/Models/HomeBanner';
import { database } from '@/lib/dbConnect';

export async function POST(req) {
  try {
    await database();
    const { title, aboutdecription, bannerimageurl } = await req.json();

    if (!title || !aboutdecription || !bannerimageurl) {
      return NextResponse.json({ message: 'Provide all data', success: false }, { status: 401 });
    }

    const addbann = await bannerModel.create({ title, aboutdecription, bannerimageurl });

    return NextResponse.json({ message: 'banner added', success: true, bann: addbann }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}