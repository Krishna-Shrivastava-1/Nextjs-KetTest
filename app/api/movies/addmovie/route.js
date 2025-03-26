import { database } from '@/lib/dbConnect';
import { client } from '@/lib/redis';
import { movieModel } from '@/Models/Movies';

import { NextResponse } from 'next/server';



export async function POST(req) {
  try {
    await database();
    const { mainmovieurl, aboutmovieurl, movieimageurl } = await req.json();

    if (!mainmovieurl || !aboutmovieurl) {
      return NextResponse.json(
        { message: 'Please fill all fields', success: false },
        { status: 400 }
      );
    }

    const saveurl = await movieModel.create({
      mainmovieurl,
      aboutmovieurl,
      movieimageurl,
    });
    // await client.del("movies");
    return NextResponse.json(
      { message: 'Movie added successfully', success: true, movie: saveurl },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}