import { NextResponse } from 'next/server';

import { database } from '@/lib/dbConnect.js';
import { movieModel } from '@/Models/Movies';

export async function PUT(req, { params }) {
  try {
    await database();
    const { id } = params;
    const { aboutmovieurl, mainmovieurl, movieimageurl } = await req.json();

    const findmovie = await movieModel.findByIdAndUpdate(
      id,
      { aboutmovieurl, mainmovieurl, movieimageurl },
      { new: true }
    );

    if (!findmovie) {
      return NextResponse.json(
        { message: 'Movie not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Movie updated successfully', success: true, movie: findmovie },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}