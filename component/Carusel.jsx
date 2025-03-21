'use client'
import React, { useEffect, useState } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import axios from 'axios';
import { Carousel, CarouselContent, CarouselItem } from './ui/carousel';

const Carusel = () => {
    const [getbann, setgetbann] = useState([]);

    const getbannimage = async () => {
        try {
            const resp = await axios.get('/api/bannerhome/getbann');
            setgetbann(resp.data.banner);
        } catch (error) {
            console.error('Error fetching banner images:', error);
        }
    };

    useEffect(() => {
        getbannimage();
    }, []);
// console.log(getbann)
    return (
        <div style={{padding:'9px'}} className='w-full flex items-center justify-center'>
            <div style={{padding:'9px'}} className='w-full '>
                <Carousel
                    opts={{
                        align: 'start',
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 7000,
                        }),
                    ]}
                >
                    <CarouselContent className="space-x-4"> {/* Added space-x-4 */}
                        {getbann.map((e, index) => (
                            <CarouselItem key={index} className='relative p-4 md:p-8 flex-shrink-0 w-full md:w-1/2 lg:w-1/3'> {/* Added flex-shrink-0 and width control */}
                                <div className="relative w-full  overflow-hidden rounded-md">
                                    <img
                                        src={e.bannerimageurl}
                                        alt={e.title}
                                        className=" w-full h-full masker"
                                    />
                                </div>
                                <div className="mt-4 text-center absolute top-[30%] left-6  w-1/2">
                                    <h2 className="text-xl md:text-2xl font-semibold">{e.title}</h2>
                                    <p className="mt-2 sm:block hidden text-sm md:text-base">{e.aboutdecription}</p>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default Carusel;