'use client'
import Carusel from '@/component/Carusel';
import Navbar from '@/component/Navbar';
import SectionofCards from '@/component/SectionofCards';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const page = () => {
    const [movies, setMovies] = useState([]);
    const [newArrOfGenres, setNewArrOfGenres] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch movies
    const allMovies = async () => {
        setLoading(true); // Set loading before fetching
        try {
            const res = await axios.get('/api/movies/fetchmoviedata');
            setMovies(res.data.movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    };




    // Fetch movies on mount
    useEffect(() => {
        allMovies();

    }, []);

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
    // Added actupdmovieforsect and movies as dependencies

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
    // console.log(filteredGenres);
    return (
        <div>
            <div className='w-full sticky top-0 z-50 bg-black/40'>
                <Navbar />
            </div>

            {loading ? (
                <div className='fixed top-0 w-full h-screen bg-black/40 flex items-center justify-center'>
                    <LoaderCircle size={60} className="animate-spin text-red-700" />
                </div>
            ) : (
                <div>
                    <Carusel />
                    <div>
                        {filteredGenres.map((e, index) => (
                            <SectionofCards key={index} maintit={e} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default page