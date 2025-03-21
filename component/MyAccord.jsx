import React, { useState } from 'react'
import { Plus } from 'lucide-react';
const MyAccord = () => {
    const [islook, setislook] = useState([0, 1, 2])
    return (
        <div className='w-full '>
            <div className=' flex items-center justify-start flex-col gap-y-1'>
                {
                    islook === 0 ? <div onClick={() => setislook(-1)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between'>
                        <h2>What is Ketflix?</h2>
                        <Plus className='rotate-45 transition-all duration-300' />
                    </div>
                        :

                        <div onClick={() => setislook(0)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between'>
                            <h2>What is Ketflix?</h2>
                            <Plus className='rotate-0 transition-all duration-300' /></div>
                }

                {
                    islook === 0 ? <div style={{ padding: '7px' }} className=' w-full  rounded-md bg-zinc-950 transition-all duration-300'>
                        <p className='w-full select-none '> Ketflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.You can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!</p>
                    </div>
                        :
                        <div className='w-full h-0 rounded-md bg-zinc-800 transition-all duration-300 opacity-0'>
                            <p className='w-full h-0   transition-all duration-300 opacity-0 hidden'> Ketflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.You can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!</p>
                        </div>

                }
                {
                    islook === 1 ? <div onClick={() => setislook(-1)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between'>
                        <h2>What can I watch on Ketflix?</h2>
                        <Plus className='rotate-45 transition-all duration-300' />
                    </div>
                        :

                        <div onClick={() => setislook(1)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between'>
                            <h2>What can I watch on Ketflix?</h2>
                            <Plus className='rotate-0 transition-all duration-300' />
                        </div>
                }

                {
                    islook === 1 ? <div style={{ padding: '7px' }} className=' w-full  rounded-md bg-zinc-950 transition-all duration-300'>
                        <p className='w-full select-none'>  Ketflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Ketflix originals, and more. Watch as much as you want, anytime you want.</p>
                    </div>
                        :
                        <div className='w-full h-0 rounded-md bg-zinc-800 transition-all duration-300 opacity-0'>
                            <p className='w-full h-0   transition-all duration-300 opacity-0 hidden'>  Ketflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Ketflix originals, and more. Watch as much as you want, anytime you want.</p>
                        </div>

                }
                {
                    islook === 2 ? <div onClick={() => setislook(-1)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between' >
                        <h2>Where can I watch?</h2>
                        <Plus className='rotate-45 transition-all duration-300' />
                    </div>
                        :

                        <div onClick={() => setislook(2)} style={{ padding: '10px' }} className='rounded-md text-left bg-zinc-900 hover:bg-zinc-800 cursor-pointer w-full flex items-center justify-between'>
                            <h2>Where can I watch?</h2>
                            <Plus className='rotate-0 transition-all duration-300' />
                        </div>
                }

                {
                    islook === 2 ? <div style={{ padding: '7px' }} className=' w-full  rounded-md bg-zinc-950 transition-all duration-300'>
                        <p className='w-full select-none'>  Watch anywhere, anytime. Sign in with your Ketflix account to watch instantly on the web at Ketflix.com from your personal computer or on any internet-connected device that offers the Ketflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.You can also download your favourite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Ketflix with you anywhere.</p>
                    </div>
                        :
                        <div className='w-full h-0 rounded-md bg-zinc-800 transition-all duration-300 opacity-0'>
                            <p className='w-full h-0   transition-all duration-300 opacity-0 hidden' >   Watch anywhere, anytime. Sign in with your Ketflix account to watch instantly on the web at Ketflix.com from your personal computer or on any internet-connected device that offers the Ketflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.You can also download your favourite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Ketflix with you anywhere.</p>
                        </div>

                }



            </div>
        </div>
    )
}

export default MyAccord