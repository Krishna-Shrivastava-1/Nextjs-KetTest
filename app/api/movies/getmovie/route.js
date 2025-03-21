import { NextResponse } from 'next/server';

import { database } from '@/lib/dbConnect';
import { movieModel } from '@/Models/Movies';


export async function GET() {
  try {
    await database();
    const getallmovie = await movieModel.find();
    return NextResponse.json(getallmovie, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}