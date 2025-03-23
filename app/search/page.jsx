'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import { CircleArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { Search } from 'lucide-react';
import { useEmail } from '@/component/EmailState';

const page = () => {
    const [jwt, setJwt] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if window is defined (client-side)
            const token = localStorage.getItem('authtoken');
            setJwt(token);
        }
    }, []);


    // const [movies, setMovies] = useState([]);
    const [querry, setquerry] = useState('');
    const [paycred, setpaycred] = useState(null); // Initialize paycred as null
    const [user, setuser] = useState(null); // Initialize user as null
    // const [loading, setLoading] = useState(false)
    const router = useRouter();
    const pathname = usePathname();
    const {loading,setLoading,movies} =  useEmail()
    // const allmovies = async () => {
    //     const res = await axios.get('http://localhost:5050/movie/getmovie');
    //     setmovies(res.data);
    // };

    // const allMovies = async () => {
    //     setLoading(true); // Set loading before fetching
    //     try {
    //         const res = await axios.get('/api/movies/fetchmoviedata');
    //         setMovies(res.data.movies);
    //     } catch (error) {
    //         console.error("Error fetching movies:", error);
    //     }
    // };




    // Fetch movies on mount




    // Fetch movies on mount
    // useEffect(() => {
    //     allMovies();

    // }, []);

    // console.log(movies)
    const forfiltmovietitle = movies.map((e) => {
        return {
            title: e?.aboutmovieData.title ?? "No Title",
            imageuri: e?.mainmovieData[0].image ?? "No image",
            ids: e?._id

        }; // "No Title" if e.title is undefined
    });
    // console.log(forfiltmovietitle)
    const searcher = forfiltmovietitle.filter((e) => {
        return e.title.toLowerCase().includes(querry.toLowerCase().trim())
    })
    // console.log(searcher)
    // useEffect(() => {
    //     allmovies();
    // }, []);



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
    // console.log(user)
    // const newim = mainmovieurl.map((e) => e.image);

    // const merarry = aboutmovies.map((e, index) => ({
    //     ...e,
    //     image: newim[index],
    //     datid: movies[index]?._id,
    // }));

    // const filter = merarry.filter((e) => e);

    // const searcher = filter.filter((e) => e.title?.toLowerCase().trim().includes(querry.toLowerCase()));

    
    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            router.back(); // Correct way to go back
        } else {
            console.log("No history or server-side. Redirecting to homepage.");
            router.push('/');
        }
    };
    
    return (
        <div style={{ padding: '4px' }} className='w-full sticky top-0 z-50 p-2 bg-black/40 backdrop-blur-[2px]'>

            <div className={`flex items-center ${pathname === '/login' ? 'justify-center' : 'justify-around'}  w-full p-1`}>



                {
                    pathname !== '/' && pathname !== '/login' ?
                        <div className='flex flex-col items-center justify-around w-full gap-x-3'>
                            <div style={{ padding: '15px' }} className=" sticky top-0 z-40 flex bg-black/60 backdrop-blur-lg group rounded-sm items-center gap-x-2  w-full p-1">
                                {/* Search Icon */}
                                <CircleArrowLeft size={30} className="text-zinc-400 cursor-pointer" onClick={handleGoBack} />
                                <Search className="text-zinc-400 cursor-pointer" />


                                {/* Search Input */}
                                <input
                                    id="ih"
                                    type="search"
                                    value={querry}
                                    onChange={(e) => setquerry(e.target.value)}
                                    placeholder="Search..."
                                    className={`transition-all duration-300 ease-in-out outline-none border-none w-full bg-zinc-900/10 text-white px-2 py-1 rounded-sm   
              `}
                                />



                            </div>

                            <div className=' scro bg-black/80 backdrop-blur-[2px] flex  items-center justify-around flex-wrap  shadow-zinc-900 '>
                                {
                                    querry ? ( // Check if querry is truthy (not empty)
                                        searcher.length > 0 ? (
                                            searcher.map((e, index) => (
                                                <div style={{ margin: '3px' }} onClick={() => router.push(`/movies/${e.ids}`)} key={index} className='flex items-center justify-center flex-wrap gap-2'>
                                                <div className='flex items-center flex-col justify-start select-none cursor-pointer hover:bg-neutral-950 max-w-[150px]'>
                                                    <img style={{ margin: "12px" }} className='w-[200px] rounded-md' src={e.imageuri} alt="" />
                                                    <h3>{e.title}</h3>
                                                </div>
                                                <hr />
                                            </div>
                                            ))
                                        ) : (
                                            <div className='w-full text-center p-4'>No movie found.</div>
                                        )
                                    ) : ( // If querry is falsy (empty)
                                        <div className='flex items-center justify-around flex-wrap'>
                                        {forfiltmovietitle.map((e, index) => (
                                            <div style={{ margin: '3px' }} onClick={() => router.push(`/movies/${e.ids}`)} key={index} className='flex items-center justify-center flex-wrap gap-2'>
                                                <div className='flex items-center flex-col justify-start select-none cursor-pointer hover:bg-neutral-950 max-w-[150px]'>
                                                    <img style={{ margin: "12px" }} className='w-[200px] rounded-md' src={e.imageuri} alt="" />
                                                    <h3>{e.title}</h3>
                                                </div>
                                                <hr />
                                            </div>
                                        ))}
                                    </div>
                                    )
                                }
                            </div>


                        </div>
                        : null
                }


            </div>
        </div>
    )
}

export default page