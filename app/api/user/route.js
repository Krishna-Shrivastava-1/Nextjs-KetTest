// import { NextResponse } from 'next/server';
// import jwt from 'jsonwebtoken';
// import { userModel } from '@/Models/User.js';
// import { database } from '@/lib/dbConnect.js';

// const secretkey = process.env.SecretKey || 'sdbmshfhfhbksbcaesikfolhfl';

// export async function GET(req) {
//   try {
//     await database();
//     const authorizationHeader = req.headers.get('Authorization');

//     if (!authorizationHeader) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     const token = authorizationHeader.split(' ')[1];

//     if (!token) {
//       return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, secretkey);
//     const user = await userModel.findById(decoded.id).select('-password');

//     if (!user) {
//       return NextResponse.json({ message: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json({ user });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { userModel } from '@/Models/User.js';
import { database } from '@/lib/dbConnect.js';

const secretkey = process.env.SecretKey || 'sdbmshfhfhbksbcaesikfolhfl';

export async function GET(req) {
  try {
    await database();
    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authorizationHeader.replace("Bearer ", "").trim();

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, secretkey, { algorithms: ['HS256'] });
    const user = await userModel.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
