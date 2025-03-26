'use client'
import Carusel from '@/component/Carusel';
import { useEmail } from '@/component/EmailState';
import Navbar from '@/component/Navbar';
import SectionofCards from '@/component/SectionofCards';
import Sectionofcontinuewatch from '@/component/Sectionofcontinuewatch';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const page = () => {
    // const [movies, setMovies] = useState([]);
    const [newArrOfGenres, setNewArrOfGenres] = useState([]);
    const [loading2, setLoading2] = useState(true);
    const [paycred, setpaycred] = useState(null); // Initialize paycred as null
    const [user, setuser] = useState(null); // Initialize user as null
    const { movies, setLoading, loading } = useEmail()
    const clerkuser = useUser().user
    const [jwt, setJwt] = useState(null);
    const [clickedmovi, setclickedmovi] = useState([]); // Initialize as null
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if window is defined (client-side)
            const token = localStorage.getItem('authtoken');
            setJwt(token);
        }
    }, []);
    useEffect(() => {
        if (jwt) {
            const parts = jwt.split('.');
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(atob(parts[1].replace('-', '+').replace('_', '/')));
                    setpaycred(payload);
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                }
            } else {
                console.error('Invalid JWT format');
            }
        }
    }, [jwt]);

    useEffect(() => {
        const loggeduser = async () => {
            if (paycred && paycred.id) {
                try {
                    const reps = await axios.get(`/api/auth/getuserbyid/${paycred?.id}`);
                    setuser(reps.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };
        loggeduser();
    }, [paycred]);
    // console.log(clerkuser)
    // Fetch movies
    // const allMovies = async () => {
    //     setLoading(true); // Set loading before fetching
    //     try {
    //         const res = await axios.get('/api/movies/fetchmoviedata');
    //         setMovies(res.data.movies);
    //     } catch (error) {
    //         console.error("Error fetching movies:", error);
    //     }
    // };




    // // Fetch movies on mount
    // useEffect(() => {
    //     allMovies();

    // }, []);

    // console.log(movies)
    const movieimagemergedaboutdat = movies.map((e) => {
        return {
            movieposter: e?.mainmovieData[0].image
        }
    })
    //   console.log(movieimagemergedaboutdat)
    const movieaboutdat = movies.map((e) => {

        return e?.aboutmovieData

    })
    const actupdmovieforsect = movieaboutdat.map((aboutMovie, index) => {
        return {
            ...aboutMovie,
            movieposter: movieimagemergedaboutdat[index]?.movieposter,
        };
    });

    // console.log(actupdmovieforsect);
    // Process genres and update loading state
    useEffect(() => {
        if (!movies || movies.length === 0) {
            setLoading(false);
            return;
        }

        const genresSet = new Set();

        actupdmovieforsect?.forEach((movie) => {
            if (movie?.genre) {
                movie.genre.split(',').forEach((g) => genresSet.add(g.trim()));
            }
        });

        const newGenres = [...genresSet];

        // Only update if the new genres are different from the previous state
        setNewArrOfGenres((prevGenres) =>
            JSON.stringify(prevGenres) === JSON.stringify(newGenres) ? prevGenres : newGenres
        );

        setLoading(false);
    }, [movies, actupdmovieforsect]); // Ensure dependencies are correct

    // List of allowed genres
    const allowedGenres = [
        'Documentary',
        'Adventure',
        'Action',
        'Horror',
        'Adult Movies',
        'Science Fiction',
        'Drama',
        'Romance',
        'Comedy',
        'Historical',
        'Kids',
    ];

    const filteredGenres = newArrOfGenres.filter((e) => allowedGenres.includes(e.trim()));
    // console.log(filteredGenres.slice(2));
    useEffect(() => {
        const fetchContinueWatching = async () => {
            try {
                const responses = await Promise.all(
                    user?.user?.continuewatching?.map(async (e) => {
                        const resp = await axios.get(`/api/movies/fetchmoviedata/${e}`);
                        return resp.data.movie;
                    }) || []
                );

                setclickedmovi(responses); // ✅ Store all fetched movies in state
                setLoading2(false)
            } catch (error) {
                console.error('Error fetching movie:', error);
            }
        };

        fetchContinueWatching();
    }, [user]); // ✅ Depend on `user` so it runs when `user` is available

    // ✅ Log whenever `clickedmovi` updates
    // useEffect(() => {
    //     console.log("Fetched Movies:", clickedmovi);
    // }, [clickedmovi]);
    // console.log(contwatch)
    // Added actupdmovieforsect and movies as dependencies
    // const getmovi = async () => {
    //     try {
    //         const resp = await axios.get(`/api/movies/fetchmoviedata/${contwatch}`);
    //         setclickedmovi(resp.data.movie);

    //     } catch (error) {
    //         console.error('Error fetching movie:', error);
    //     }
    // };



    // useEffect(() => {
    //     getmovi();
    // }, [contwatch]);

    return (
        <div>
            <div className='w-full sticky top-0 z-50 bg-black/40'>
                <Navbar movies={movies} />
            </div>

            {loading ? (
                <div className='fixed top-0 w-full h-screen bg-black/40 flex items-center justify-center'>
                    <LoaderCircle size={60} className="animate-spin text-red-700" />
                </div>
            ) : (
                <div>
                    <Carusel />
                    <div>
                        {filteredGenres.slice(0, 2).map((e, index) => (
                            <SectionofCards key={index} maintit={e} />
                        ))}
                    </div>
                    <div>
                        {clickedmovi?.length > 0 ?
                           
                                <div>
                                    
                                  
                                    <Sectionofcontinuewatch movies={clickedmovi} loading={loading2} user={user} />
                                </div>
                           :
                           null  
                        }


                    </div>
                    <div>
                        {filteredGenres.slice(2).map((e, index) => (
                            <SectionofCards key={index} maintit={e} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default page