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


// only implmented Redis
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


// Rate limited and redis
import { database } from '@/lib/dbConnect';
import { movieModel } from '@/Models/Movies';
import { client } from '@/lib/redis';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET(req) {
    const startTime = Date.now(); // Track execution time
    const timeoutLimit = 9000; // 9 seconds

    try {
        await database(); // Connect to MongoDB

        // Check Redis cache first
        const cachedMovies = await client.get('movies');
        if (cachedMovies) {
            console.log("🔹 Returning cached movies from Redis");
            return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
        }

        const batchSizeMongo = 50; // Fetch 50 movies per batch
        const batchSizeAPI = 10;   // Fetch 10 movies per batch
        let allMoviesWithDetails = [];
        let skip = 0;

        while (true) {
            if (Date.now() - startTime > timeoutLimit) {
                console.warn("⚠️ Stopping execution due to timeout");
                break;
            }

            const movies = await movieModel.find().skip(skip).limit(batchSizeMongo);
            if (movies.length === 0) break;

            console.log(`🔹 Fetching batch of ${movies.length} movies from MongoDB`);

            let moviesWithDetails = [];

            // Fetch movie details **concurrently** to reduce execution time
            const batchResults = await Promise.allSettled(
                movies.map(async (movie) => {
                    if (Date.now() - startTime > timeoutLimit) return null;

                    let aboutmovieData = 'nothing';
                    let mainmovieData = 'nothing';

                    try {
                        if (movie.aboutmovieurl) {
                            const aboutRes = await axios.get(movie.aboutmovieurl, { timeout: 5000 });
                            aboutmovieData = aboutRes.data;
                        }
                    } catch (error) {
                        console.error(`❌ Error fetching aboutmovie for ${movie._id}:`, error.message);
                    }

                    try {
                        if (movie.mainmovieurl) {
                            const mainRes = await axios.get(movie.mainmovieurl, { timeout: 5000 });
                            mainmovieData = mainRes.data;
                        }
                    } catch (error) {
                        console.error(`❌ Error fetching mainmovie for ${movie._id}:`, error.message);
                    }

                    return { ...movie._doc, aboutmovieData, mainmovieData };
                })
            );

            // Filter out failed promises
            moviesWithDetails = batchResults
                .filter(result => result.status === "fulfilled" && result.value !== null)
                .map(result => result.value);

            allMoviesWithDetails.push(...moviesWithDetails);
            skip += batchSizeMongo;

            console.log(`🚀 Processed ${allMoviesWithDetails.length} movies`);

            if (Date.now() - startTime > timeoutLimit) {
                console.warn("⚠️ Stopping execution due to timeout");
                break;
            }
        }

        // Store in Redis for caching
        await client.set('movies', JSON.stringify(allMoviesWithDetails), { EX: 7200 });

        console.log("✅ Stored fetched movies in Redis");
        return Response.json({ success: true, movies: allMoviesWithDetails }, { status: 200 });

    } catch (error) {
        console.error('❌ Error fetching movies:', error);
        return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// export async function GET(req) {
//     try {
//         await database(); // Connect to MongoDB
//         // await client.del("movies");
//         // Check Redis cache first
//         const cachedMovies = await client.get('movies');
//         if (cachedMovies) {
//             console.log("🔹 Returning cached movies from Redis");
//             return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
//         }

//         const batchSizeMongo = 50; // Fetch 50 documents per batch from MongoDB
//         const batchSizeAPI = 10;   // Fetch 10 movies per batch from netfree.cc API
//         let allMoviesWithDetails = [];
//         let skip = 0;

//         while (true) {
//             // Fetch 50 movies at a time from MongoDB
//             const movies = await movieModel.find().skip(skip).limit(batchSizeMongo);
//             if (movies.length === 0) break; // Stop when no more movies

//             console.log(`🔹 Fetching batch of ${movies.length} movies from MongoDB`);

//             let moviesWithDetails = [];

//             for (let i = 0; i < movies.length; i += batchSizeAPI) {
//                 const batch = movies.slice(i, i + batchSizeAPI);

//                 const batchResults = await Promise.all(
//                     batch.map(async (movie) => {
//                         let aboutmovieData = 'nothing';
//                         let mainmovieData = 'nothing';

//                         try {
//                             if (movie.aboutmovieurl) {
//                                 const aboutRes = await axios.get(movie.aboutmovieurl);
//                                 aboutmovieData = aboutRes.data;
//                             }
//                         } catch (error) {
//                             console.error(`❌ Error fetching aboutmovie for ${movie._id}:`, error);
//                         }

//                         try {
//                             if (movie.mainmovieurl) {
//                                 const mainRes = await axios.get(movie.mainmovieurl);
//                                 mainmovieData = mainRes.data;
//                             }
//                         } catch (error) {
//                             console.error(`❌ Error fetching mainmovie for ${movie._id}:`, error);
//                         }

//                         return {
//                             ...movie._doc, // MongoDB document data
//                             aboutmovieData,
//                             mainmovieData,
//                         };
//                     })
//                 );

//                 moviesWithDetails.push(...batchResults);
//                 console.log(`✅ Processed API batch ${i / batchSizeAPI + 1}`);

//                 await delay(3000); // 3-second delay to avoid getting flagged
//             }

//             allMoviesWithDetails.push(...moviesWithDetails);
//             skip += batchSizeMongo; // Move to next batch in MongoDB

//             console.log(`🚀 Completed processing MongoDB batch, total movies: ${allMoviesWithDetails.length}`);
//         }

//         // Cache data in Redis for 2 hours
//         await client.set('movies', JSON.stringify(allMoviesWithDetails), { EX: 7200 });

//         console.log("✅ Stored fetched movies in Redis");

//         return Response.json({ success: true, movies: allMoviesWithDetails }, { status: 200 });

//     } catch (error) {
//         console.error('❌ Error fetching movies:', error);
//         return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
//     }
// }

// import { database } from '@/lib/dbConnect';
// import { movieModel } from '@/Models/Movies';
// import { client } from '@/lib/redis';
// import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// // Helper function to add delay
// const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// export async function GET(req) {
//     // const api = req.headers.get('x-api-key') ? null: '12345-abcdef-67890-ghijkl'
//     // const validapi = process.env.API_SECRET_KEY
//     // console.log(api)
//     // console.log(validapi)
//     // if (!api || api !== validapi) {
//     //     return Response.json({message:'Unauhtorized'})
//     // } 
   
//     try {
//         await database(); // Connect to MongoDB

//         // Check if data is cached in Redis
//         const cachedMovies = await client.get('movies');
//         if (cachedMovies) {
           
        
//             console.log("🔹 Returning cached movies from Redis");
//             return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
//         }

//         const movies = await movieModel.find();
//         const batchSize = 10; // Fetch movies in batches of 10
//         let moviesWithDetails = [];

//         for (let i = 0; i < movies.length; i += batchSize) {
//             const batch = movies.slice(i, i + batchSize);

//             const batchResults = await Promise.all(
//                 batch.map(async (movie) => {
//                     let aboutmovieData = 'nothing';
//                     let mainmovieData = 'nothing';

//                     try {
//                         if (movie.aboutmovieurl) {
//                             const aboutRes = await axios.get(movie.aboutmovieurl);
//                             aboutmovieData = aboutRes.data;
//                         }
//                     } catch (error) {
//                         console.error(`Error fetching aboutmovie for ${movie._id}:`, error);
//                     }

//                     try {
//                         if (movie.mainmovieurl) {
//                             const mainRes = await axios.get(movie.mainmovieurl);
//                             mainmovieData = mainRes.data;
//                         }
//                     } catch (error) {
//                         console.error(`Error fetching mainmovie for ${movie._id}:`, error);
//                     }

//                     return {
//                         ...movie._doc, // Return other movie fields
//                         aboutmovieData,
//                         mainmovieData,
//                     };
//                 })
//             );

//             moviesWithDetails.push(...batchResults);

//             console.log(`✅ Processed batch ${i / batchSize + 1}`);

//             // Delay before the next batch
//             await delay(3000); // 3-second delay to prevent being flagged
//         }

//         // Store result in Redis for 3.5 hours (12600 seconds)
//         await client.set('movies', JSON.stringify(moviesWithDetails), { EX: 7200 });

//         console.log("✅ Fetched movies from MongoDB and stored in Redis");

//         return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
//     } catch (error) {
//         console.error('Error fetching movies:', error);
//         return Response.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
//     }
// }


// redis and rate limit and proxy server

// import { database } from '@/lib/dbConnect';
// import { movieModel } from '@/Models/Movies';
// import { client } from '@/lib/redis';
// import axios from 'axios';

// const fetchFromProxy = async (url) => {
//     try {
//       const response = await axios.get(`/api/proxy?url=${encodeURIComponent(url)}`);
//       return response.data;
//     } catch (error) {
//       console.error("Proxy Fetch Error:", error.message);
//       return "nothing"; // Default value if request fails
//     }
//   };
  
//   export async function GET(req) {
//     const apiKey = req.headers.get('x-api-key'); // Get API key from request header
//     const validKey = process.env.API_SECRET_KEY; // Backend API key
// console.log(apiKey)
//     console.log("Received API Key:", apiKey);
//     console.log("Expected API Key:", validKey);
  
    
//     if (!apiKey || apiKey !== validKey) {
//         return Response.json({ success: false, error: "Unauthorized access" }, { status: 401 });
//     }
   
//     try {
//       await database(); // Connect to MongoDB
  
//       const cachedMovies = await client.get("movies");
//       if (cachedMovies) {
//         console.log("🔹 Returning cached movies from Redis");
//         return Response.json({ success: true, movies: JSON.parse(cachedMovies) }, { status: 200 });
//       }
  
//       const movies = await movieModel.find();
//       const batchSize = 10;
//       let moviesWithDetails = [];
  
//       for (let i = 0; i < movies.length; i += batchSize) {
//         const batch = movies.slice(i, i + batchSize);
  
//         const batchResults = await Promise.all(
//           batch.map(async (movie) => {
//             let aboutmovieData = await fetchFromProxy(movie.aboutmovieurl);
//             let mainmovieData = await fetchFromProxy(movie.mainmovieurl);
  
//             return {
//               ...movie._doc,
//               aboutmovieData,
//               mainmovieData,
//             };
//           })
//         );
  
//         moviesWithDetails.push(...batchResults);
//         console.log(`✅ Processed batch ${i / batchSize + 1}`);
//         await new Promise((resolve) => setTimeout(resolve, 3000)); // 3s delay
//       }
  
//       await client.set("movies", JSON.stringify(moviesWithDetails), { EX: 12600 });
//       console.log("✅ Fetched movies from MongoDB and stored in Redis");
  
//       return Response.json({ success: true, movies: moviesWithDetails }, { status: 200 });
//     } catch (error) {
//       console.error("Error fetching movies:", error);
//       return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
//     }
//   }
  