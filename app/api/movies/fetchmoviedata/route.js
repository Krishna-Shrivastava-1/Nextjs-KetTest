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


// import { database } from '@/lib/dbConnect';
// import { movieModel } from '@/Models/Movies';


// import axios from 'axios';

// export async function GET() {
//     try {
//         await database(); // Connect to MongoDB

//         const movies = await movieModel.find(); // Get all movies

//         // Fetch `aboutmovieurl` and `mainmovieurl` for each movie
//         const moviesWithDetails = await Promise.all(
//             movies.map(async (movie) => {
//                 let aboutmovieData = 'nothing';
//                 let mainmovieData = 'nothing';

//                 try {
//                     if (movie.aboutmovieurl) {
//                         const aboutRes = await axios.get(movie.aboutmovieurl);
//                         aboutmovieData = aboutRes.data;
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching aboutmovie for ${movie._id}:`, error);
//                 }

//                 try {
//                     if (movie.mainmovieurl) {
//                         const mainRes = await axios.get(movie.mainmovieurl);
//                         mainmovieData = mainRes.data;
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching mainmovie for ${movie._id}:`, error);
//                 }

//                 return {
//                     ...movie._doc, // Return other movie fields
//                     aboutmovieData,
//                     mainmovieData,
//                 };
//             })
//         );

//         return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
//     }
// }



// import { database } from '@/lib/dbConnect';
// import { movieModel } from '@/Models/Movies';
// import { client } from '@/lib/redis';

// import axios from 'axios';

// export async function GET() {
//     try {
//         await database(); // Connect to MongoDB

//         // Check if data is cached in Redis
//         const cachedMovies = await client.get('movies');
//         if (cachedMovies) {
//             console.log("🔹 Returning cached movies from Redis");
//             return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
//         }

//         const movies = await movieModel.find();

//         // Fetch `aboutmovieurl` and `mainmovieurl` for each movie
//         const moviesWithDetails = await Promise.all(
//             movies.map(async (movie) => {
//                 let aboutmovieData = 'nothing';
//                 let mainmovieData = 'nothing';

//                 try {
//                     if (movie.aboutmovieurl) {
//                         const aboutRes = await axios.get(movie.aboutmovieurl);
//                         aboutmovieData = aboutRes.data;
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching aboutmovie for ${movie._id}:`, error);
//                 }

//                 try {
//                     if (movie.mainmovieurl) {
//                         const mainRes = await axios.get(movie.mainmovieurl);
//                         mainmovieData = mainRes.data;
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching mainmovie for ${movie._id}:`, error);
//                 }

//                 return {
//                     ...movie._doc, // Return other movie fields
//                     aboutmovieData,
//                     mainmovieData,
//                 };
//             })
//         );

//         // Store result in Redis for 1 hour (3600 seconds)
//         await client.set('movies', JSON.stringify(moviesWithDetails), {
//             EX: 7200, // Expiration time (2 hour)
//         });

//         console.log("✅ Fetched movies from MongoDB and stored in Redis");

//         return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
//     }
// }



import { database } from '@/lib/dbConnect';
import { movieModel } from '@/Models/Movies';
import { client } from '@/lib/redis';
import axios from 'axios';

// Helper function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
    try {
        await database(); // Connect to MongoDB

        // Check if data is cached in Redis
        const cachedMovies = await client.get('movies');
        if (cachedMovies) {
            console.log("🔹 Returning cached movies from Redis");
            return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
        }

        const movies = await movieModel.find();
        const batchSize = 10; // Fetch movies in batches of 10
        let moviesWithDetails = [];

        for (let i = 0; i < movies.length; i += batchSize) {
            const batch = movies.slice(i, i + batchSize);

            const batchResults = await Promise.all(
                batch.map(async (movie) => {
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

            moviesWithDetails.push(...batchResults);

            console.log(`✅ Processed batch ${i / batchSize + 1}`);

            // Delay before the next batch
            await delay(3000); // 3-second delay to prevent being flagged
        }

        // Store result in Redis for 3.5 hours (12600 seconds)
        await client.set('movies', JSON.stringify(moviesWithDetails), { EX: 12600 });

        console.log("✅ Fetched movies from MongoDB and stored in Redis");

        return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
