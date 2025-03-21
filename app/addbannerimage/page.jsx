'use client'

import Leftowner from '@/component/Leftowner'
import axios from 'axios'

import React, { useEffect, useState } from 'react'

const AddBannerIMage = () => {
    const [banner, setbanner] = useState('')
    const [title, settitle] = useState('')
    const [descri, setdescri] = useState('')
    const [getbann, setgetbann] = useState([[]])
    const getbannimage = async () => {
        const resp = await axios.get('/api/bannerhome/getbann')
        setgetbann(resp.data.banner)
    }
    const givebanner = async () => {
        try {
            await axios.post('/api/bannerhome/addnewbann', {
                title,
                aboutdecription: descri,
                bannerimageurl: banner

            })
            settitle('')
            setdescri('')
            setbanner('')
            getbannimage()
            // console.log('success')
        } catch (error) {
            console.log(error)
        }
    }
   
    useEffect(() => {
        getbannimage()
    }, [])
    const deletebanner = async (id, title) => {
        const confirmation = window.confirm(`Really want to delete banner?  - ${title}`)
        try {
            if (confirmation) {
                await axios.delete(`/api/bannergome/deletebann/${id}`)
                getbannimage()
                console.log('deleted')

            }
        } catch (error) {
            alert("can't able to delete")
            console.log(error)
        }

    }
    // console.log(getbann)
    return (
        <div>
            <div className='flex w-full items-start h-screen overflow-y-auto '>
                <Leftowner />
                <div className='flex items-center justify-center w-full h-screen'>
                    <div className='flex flex-col w-[60%] gap-y-2.5'>
                        <input
                            value={title}
                            onChange={(e) => settitle(e.target.value)} // Add onChange handler
                            placeholder='Title of movie'
                            style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                            type="text"
                            className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md'
                        />
                        <textarea
                            value={descri}
                            onChange={(e) => setdescri(e.target.value)} // Add onChange handler
                            placeholder='About banner para'
                            style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                            type="text"
                            className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md'
                        />
                        <input
                            value={banner}
                            onChange={(e) => setbanner(e.target.value)} // Add onChange handler
                            placeholder='Homepage Banner URL'
                            style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                            type="text"
                            className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-green-500 rounded-md'
                        />

                        <button style={{ marginTop: '12px', padding: '5px' }} type='submit'
                            onClick={givebanner}
                            className='bg-red-700 w-full hover:bg-red-600 cursor-pointer'>Publish</button>
                    </div>
                </div>
                <div>
                    {
                        getbann.map((e, index) => (
                            <div key={index}>
                                <img src={e.bannerimageurl} alt="" />
                                <h2>{e.title}</h2>
                                <p>{e.aboutdecription}</p>
                                <button onClick={() => deletebanner(e._id, e.title)}>Delete</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default AddBannerIMage