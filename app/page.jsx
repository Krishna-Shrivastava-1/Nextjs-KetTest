'use client';
import Homepagebackbanner from '@/component/Homepagebackbanner';
import Morereson from '@/component/Morereson';
import MyAccord from '@/component/MyAccord';
import Navbar from '@/component/Navbar';
import React from 'react';
import Link from 'next/link';
import { useEmail } from '@/component/EmailState';

const Homepage = () => {
  const { email, setEmail } = useEmail();
    const enteremail = (e) => {
      setEmail(e.target.value);
    };

    return (
        <div>
            <div className='w-full sticky top-0 z-50 bg-black/40'>
                <Navbar />
            </div>
            <Homepagebackbanner />
            <div className='p-3 w-full h-[90vh] flex items-center justify-center'>
                <div className='z-30 md:w-[60%] w-[90%] text-center'>
                    <h1 className='text-white text-4xl font-bold'>Unlimited movies, TV shows and more</h1>
                    <p className='text-zinc-300'>Ready to watch? Enter your email to create your stream.</p>
                    <div className='w-full flex items-center justify-center' style={{ margin: '4px' }}>
                        <div className='md:w-[80%] w-[90%] flex-wrap md:flex-nowrap flex items-center justify-center'>
                            <input
                                value={email}
                                onChange={enteremail}
                                placeholder='Email address'
                                style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                                type='email'
                                className='outline-none border-none w-full bg-black/70 text-white text-lg'
                            />
                            <Link href={'/login'}>
                                <div style={{ padding: '4px' }} className='text-nowrap bg-red-700 hover:bg-red-600 cursor-pointer select-none'>
                                    Get Started
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className=''>
                <Morereson />
            </div>
            <div className='flex items-center flex-col justify-center w-full'>
                <div className='w-[90%]'>
                    <MyAccord />
                </div>
                <div style={{ marginTop: '30px' }} className='md:w-[60%] w-[90%]'>
                    <p className='text-zinc-300 text-center'>Ready to watch? Enter your email to create your stream.</p>
                    <div className='w-full flex items-center justify-center' style={{ margin: '4px' }}>
                        <div className='md:w-[80%] w-[90%] flex-wrap md:flex-nowrap flex items-center justify-center'>
                            <input
                                value={email}
                                onChange={enteremail}
                                placeholder='Email address'
                                style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }}
                                type='email'
                                className='outline-none border-none w-full bg-black/70 text-white text-lg'
                            />
                            <Link href={'/login'}>
                                <div style={{ padding: '4px' }} className='text-nowrap bg-red-700 hover:bg-red-600 cursor-pointer select-none'>
                                    Get Started
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Homepage;