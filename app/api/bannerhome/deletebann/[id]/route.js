// app/api/banners/delete/[id]/route.js (DELETE /api/banners/delete/:id)
import { database } from '@/lib/dbConnect';
import { bannerModel } from '@/Models/HomeBanner';
import { NextResponse } from 'next/server';


export async function DELETE(req, { params }) {
  try {
    await database();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ message: 'Banner ID not provided' }, { status: 400 });
    }

    const delet = await bannerModel.findByIdAndDelete(id);

    if (!delet) {
      return NextResponse.json({ message: 'Banner not found to delete' }, { status: 404 });
    }

    return NextResponse.json({ message: 'deleted', delet }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}