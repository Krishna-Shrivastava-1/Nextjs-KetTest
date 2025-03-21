'use client'

import Leftowner from '@/component/Leftowner';
import axios from 'axios'
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'


const Editmovie = () => {
    const [mainurl, setmainurl] = useState('');
    const [abouturl, setabouturl] = useState('')
    const [movieimageurl, setmovieimageurl] = useState('')
    const { id } = useParams();

    const getmovi = async () => {
        const resp = await axios.get(`/api/movies/getmoviebyid/${id}`);
        setmainurl(resp.data.mainmovieurl || '');
        setabouturl(resp.data.aboutmovieurl || '')
        setmovieimageurl(resp.data.movieimageurl || '')
    };

    useEffect(() => {
        getmovi();
    }, []);

    const handleMainUrlChange = (event) => {
        setmainurl(event.target.value);

    };
    const handleAboutUrlChange = (event) => {

        setabouturl(event.target.value)
    };
    const handleMovieImageUrlChange = (event) => {

        setmovieimageurl(event.target.value)
    };

    const editmovie = async (id) => {
        await axios.put(`/api/movies/editmovie/${id}`,{
            mainmovieurl:mainurl,
            aboutmovieurl:abouturl,
            movieimageurl
        })
        console.log("edited")
    }
    return (
        <div>
            <div className='flex w-full items-start h-screen overflow-y-auto '>
                <Leftowner />
                <div className='flex items-center justify-center w-full h-screen'>
                    <div className='flex flex-col w-[60%] gap-y-2.5'>
                        <input
                            value={mainurl}
                            onChange={handleMainUrlChange} // Add onChange handler
                            placeholder='Moviemain URL'
                            style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                            type="text"
                            className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md'
                        />
                        <input value={abouturl} onChange={handleAboutUrlChange} placeholder='Movieabout URL' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md' />
                        <input value={movieimageurl} onChange={handleMovieImageUrlChange} placeholder='Movieimage URL' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md' />
                        <button style={{ marginTop: '12px', padding: '5px' }} type='submit' onClick={() => editmovie(id)} className='bg-red-700 w-full hover:bg-red-600 cursor-pointer'>Publish</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editmovie;