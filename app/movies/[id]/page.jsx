'use client'
import VideoPlayer from '@/component/CustomPlayer';
import { useEmail } from '@/component/EmailState';
import Navbar from '@/component/Navbar';
import axios from 'axios';
import { CircleX, LoaderCircle } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaPlay } from "react-icons/fa6";
const page = () => {

    const [clickedmovi, setclickedmovi] = useState(null); // Initialize as null
    const { movies } = useEmail()
    // console.log(movies)
    const [isplayed, setisplayed] = useState(false)
    const [loading, setloading] = useState(true)
    const { id } = useParams();
    const [showcross, setshowcross] = useState(true)
    const getmovi = async () => {
        try {
            const resp = await axios.get(`/api/movies/fetchmoviedata/${id}`);
            setclickedmovi(resp.data.movie);
            setloading(false)
        } catch (error) {
            console.error('Error fetching movie:', error);
        }
    };



    useEffect(() => {
        getmovi();
    }, [id]);



    // console.log(clickedmovi);
    const langofmovi = clickedmovi?.aboutmovieData?.lang.map((e, index) => {
        return e?.l
    })
    // console.log(langofmovi)
    //   console.log(clickedmovi?.aboutmovieData?.title);
    const moveUrl = clickedmovi && clickedmovi?.mainmovieData[0].sources[0]?.file;
    const finalmovUrl = 'https://netfree.cc' + moveUrl
    //   console.log(finalmovUrl)
    return (
        <div>

            {loading ?
                <div className='w-full absolute top-0 h-screen flex items-center justify-center bg-black/40'><LoaderCircle size={50} className="animate-spin text-red-700" /></div>
                :
                !isplayed && <div>
                    <div className='w-full sticky top-0 z-50 bg-black/40 '>
                        <Navbar />
                    </div>
                    <div className='w-full flex items-center justify-center '>

                        <div  >
                            <div style={{ width: '100%', aspectRatio: '16/9' }}> {/* Adjust aspectRatio as needed */}
                                {/* <Image
                                    src={clickedmovi?.mainmovieData[0]?.image}
                                    alt=""
                                    layout="responsive"
                                    width={16} // Aspect ratio width
                                    height={9} // Aspect ratio height
                                    style={{ objectFit: 'cover' }} // Or objectFit: 'contain'
                                    className='masker'
                                /> */}
                                <img
                                    src={clickedmovi?.mainmovieData[0]?.image}
                                    alt=""



                                    style={{ objectFit: 'cover' }} // Or objectFit: 'contain'
                                    className='masker'
                                />
                            </div>
                            <div className='absolute top-[10%] md:top-[30%] left-5 md:left-26'>
                                <div className='md:min-w-[55%] relative w-full '>
                                    <h1 className='text-5xl font-extrabold'>{clickedmovi && clickedmovi?.aboutmovieData?.title}</h1>
                                    <p className='line-clamp-2 w-[45%] '>{clickedmovi && clickedmovi?.aboutmovieData?.desc}</p>
                                    <div className='flex items-center text-lg gap-x-6 flex-wrap'>
                                        <p >{clickedmovi && clickedmovi?.aboutmovieData?.match}</p>
                                        <p >{clickedmovi && clickedmovi?.aboutmovieData?.runtime}</p>
                                        <p >{clickedmovi && clickedmovi?.aboutmovieData?.year}</p>
                                        <p style={{ padding: '3px', paddingLeft: '4px', paddingRight: '4px' }} className='bg-zinc-800/80 cursor-pointer select-none rounded-md'>{clickedmovi && clickedmovi?.aboutmovieData?.hdsd}</p>
                                        <p style={{ padding: '3px', paddingLeft: '4px', paddingRight: '4px' }} className='bg-zinc-800/80  cursor-pointer select-none rounded-md text-nowrap'>{clickedmovi && clickedmovi?.aboutmovieData?.ua}</p>
                                    </div>
                                    <div className='  items-center justify-start'>
                                        <p className='text-lg font-semibold'>{clickedmovi && clickedmovi?.aboutmovieData?.genre}</p>

                                    </div>
                                    <div onClick={() => setisplayed(true)} style={{ padding: '6px', paddingLeft: '6px', paddingRight: '6px' }} className='bg-zinc-400/60 w-[120px] cursor-pointer select-none flex items-center justify-around rounded-md hover:bg-white hover:text-black transition-all duration-500'>
                                        <FaPlay className='text-4xl' />
                                        <h2 className='text-lg font-bold'>Play</h2>
                                    </div>
                                    <div className='sm:hidden min-h-28 flex flex-col w-full items-center justify-center   '>
                                        <div style={{margin:'10px'}} className='w-full flex flex-col items-start'>
                                            <div className='h-[0.5px] bg-zinc-600 w-full'></div>
                                            <div>
                                                <h2 className='font-bold'>About movie</h2>
                                                <p>{clickedmovi && clickedmovi?.aboutmovieData?.desc}</p>
                                            </div>
                                            <div>
                                                <h2 className='font-bold'>Available laguages</h2>
                                                <div className='flex items-center flex-wrap'>
                                                {
    clickedmovi && langofmovi.map((e, index) => (
        <p key={index} style={{ margin: '4px' }} className='gap-x-3 flex items-center'>
            {e}
        </p>
    ))
}

                                                </div>

                                            </div>
                                            <div className='h-[0.5px] bg-zinc-600 w-full'></div>
                                            <div>
                                                <h2 className='font-bold'>Cast</h2>
                                                <p>{clickedmovi && clickedmovi?.aboutmovieData?.cast}</p>
                                                <div className='flex items-center '><h2 className='font-bold'>Writer : </h2>
                                                    <p>{clickedmovi && clickedmovi?.aboutmovieData?.writer}</p></div>
                                                <div className='flex items-center '> <h2 className='font-bold'>Director : </h2>
                                                    <p>{clickedmovi && clickedmovi?.aboutmovieData?.director}</p></div>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div style={{padding:'9px'}} className='hidden sm:flex flex-col w-full items-center justify-center  '>
                                        <div style={{padding:'9px'}} className='w-full flex flex-col items-start'>
                                            <div className='h-[0.5px] bg-zinc-600 w-full'></div>
                                            <div>
                                                <h2 className='font-bold'>About movie</h2>
                                                <p>{clickedmovi && clickedmovi?.aboutmovieData?.desc}</p>
                                            </div>
                                            <div>
                                                <h2 className='font-bold'>Available laguages</h2>
                                                <div className='flex items-center flex-wrap'>
                                                {
    clickedmovi && langofmovi.map((e, index) => (
        <p key={index} style={{ margin: '4px' }} className='gap-x-3 flex items-center'>
            {e}
        </p>
    ))
}

                                                </div>

                                            </div>
                                            <div className='h-[0.5px] bg-zinc-600 w-full'></div>
                                            <div>
                                                <h2 className='font-bold'>Cast</h2>
                                                <p>{clickedmovi && clickedmovi?.aboutmovieData?.cast}</p>
                                                <div className='flex items-center '><h2 className='font-bold'>Writer : </h2>
                                                    <p>{clickedmovi && clickedmovi?.aboutmovieData?.writer}</p></div>
                                                <div className='flex items-center '> <h2 className='font-bold'>Director : </h2>
                                                    <p>{clickedmovi && clickedmovi?.aboutmovieData?.director}</p></div>
                                            </div>

                                        </div>
                                    </div>
                        </div>

                    </div>

                </div>
            }

            <div className='relative'>
                {
                    isplayed && showcross ? <p className='absolute right-6 top-3 text-4xl select-none cursor-pointer z-30' onClick={() => setisplayed(false)}>  <CircleX className='text-red-700  size-10 select-none cursor-pointer' /></p> : null
                }

                {
                    isplayed ? <div className=' h-[97vh] flex items-center justify-center'>
                        <VideoPlayer setcross={setshowcross} src={`/api/video?url=${encodeURIComponent(finalmovUrl)}`} />
                    </div> : null

                }
            </div>

        </div>
    )
}

export default page