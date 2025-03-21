import { NextResponse } from 'next/server';

import { database } from '@/lib/dbConnect.js';
import { movieModel } from '@/Models/Movies';

export async function GET(req, { params }) {
  try {
    await database();
    const { id } = params;
    const getmoviebyid = await movieModel.findById(id);
    if (!getmoviebyid) {
      return NextResponse.json(
        { message: 'Movie not found', success: false },
        { status: 404 }
      );
    }
    return NextResponse.json(getmoviebyid, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}