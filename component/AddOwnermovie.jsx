'use client'
import axios from 'axios'
import React, { useState } from 'react'

const AddOwnermovie = () => {
    const [mainurl, setmainurl] = useState('')
    const [abouturl, setabouturl] = useState('')
    const [moviepageurl, setmoviepageurl] = useState('')
    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            await axios.post('http://localhost:5050/movie/addmovie', {
                mainmovieurl: mainurl,
                aboutmovieurl: abouturl,
                movieimageurl:moviepageurl
            })
            setmainurl('')
            setabouturl('')
            setmoviepageurl('')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <form onSubmit={handlesubmit} className='flex flex-col w-[60%] gap-y-2.5' >
                <input value={mainurl} onChange={(e) => setmainurl(e.target.value)} required placeholder='Moviemain URL' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md' />
                <input value={abouturl} onChange={(e) => setabouturl(e.target.value)} required placeholder='Movieabout URL' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md' />
                <input value={moviepageurl} onChange={(e) => setmoviepageurl(e.target.value)} placeholder='Movieimage URL' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md' />
                <button style={{ marginTop: '12px', padding: '5px' }} type='submit' className='bg-red-700 w-full hover:bg-red-600 cursor-pointer'>Publish</button>
            </form>
        </div>
    )
}

export default AddOwnermovie