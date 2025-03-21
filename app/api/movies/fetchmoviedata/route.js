// import axios from 'axios';

// export async function GET(req) {  // Use named export for GET request
//     try {
//         // Fetch aboutmovie
//         let aboutmovieData = 'nothing';
//         try {
//             const aboutRes = await axios.get('https://netfree.cc/pv/post.php?id=0NSZS37NASB0OI8JLJEC5O166I&t=1742201149');
//             aboutmovieData = aboutRes.data;
//         } catch (error) {
//             console.error('Error fetching aboutmovie:', error);
//         }

//         // Fetch mainmovie
//         let mainmovieData = 'nothing';
//         try {
//             const mainRes = await axios.get('https://netfree.cc/pv/playlist.php?id=0NSZS37NASB0OI8JLJEC5O166I&tm=1742201240');
//             mainmovieData = mainRes.data;
//         } catch (error) {
//             console.error('Error fetching mainmovie:', error);
//         }

//         return Response.json({ aboutmovieData, mainmovieData }, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching movie data:', error);
//         return Response.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
// }


import { database } from '@/lib/dbConnect';
import { movieModel } from '@/Models/Movies';


import axios from 'axios';

export async function GET() {
    try {
        await database(); // Connect to MongoDB

        const movies = await movieModel.find(); // Get all movies

        // Fetch `aboutmovieurl` and `mainmovieurl` for each movie
        const moviesWithDetails = await Promise.all(
            movies.map(async (movie) => {
                let aboutmovieData = 'nothing';
                let mainmovieData = 'nothing';

                try {
                    if (movie.aboutmovieurl) {
                        const aboutRes = await axios.get(movie.aboutmovieurl);
                        aboutmovieData = aboutRes.data;
                    }
                } catch (error) {
                    console.error(`Error fetching aboutmovie for ${movie._id}:`, error);
                }

                try {
                    if (movie.mainmovieurl) {
                        const mainRes = await axios.get(movie.mainmovieurl);
                        mainmovieData = mainRes.data;
                    }
                } catch (error) {
                    console.error(`Error fetching mainmovie for ${movie._id}:`, error);
                }

                return {
                    ...movie._doc, // Return other movie fields
                    aboutmovieData,
                    mainmovieData,
                };
            })
        );

        return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
