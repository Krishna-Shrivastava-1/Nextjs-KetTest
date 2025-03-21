import { NextResponse } from 'next/server';

import { database } from '@/lib/dbConnect.js';
import { movieModel } from '@/Models/Movies';

export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = params;

    const deletedMovie = await movieModel.findByIdAndDelete(id);

    if (!deletedMovie) {
      return NextResponse.json(
        { message: 'Movie not found', success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Movie deleted successfully', success: true },
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