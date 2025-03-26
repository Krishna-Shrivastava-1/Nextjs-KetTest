
'use client';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import Image from 'next/image';
import { Trash } from 'lucide-react';
const Sectionofcontinuewatch = ({ movies: initialMovies, user }) => {
  const [movies, setMovies] = useState(initialMovies); // ✅ Store movies in state
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true); // Start loading when `initialMovies` changes
    setTimeout(() => {
      setMovies(initialMovies);
      setLoading(false); // Stop loading after a delay
    }, 1000); // 1-second delay for better UI
  }, [initialMovies]);
  // const [loading, setLoading] = useState(true);


  // Slider settings
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 720, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };
  // console.log(user?.user?._id)
  const deletecontnuewatch = async (id) => {
    // console.log("Deleting movie:", id, "for user:", user?.user?._id);

    try {
      await axios.delete('/api/continuewatch/deletecontinuewatch', {
        data: {  // ✅ Pass `data` correctly
          userId: user?.user?._id,
          id: id
        }
      });
      setMovies((prevMovies) => prevMovies.filter(movie => movie._id !== id));
      // console.log('✅ Movie deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting:', error.response?.data || error.message);
    }
  };
  // console.log(movies)
  return (
    <div className="w-full p-4">
 {
            movies.length >0 && <div style={{ paddingLeft: '33px', margin: '10px' }} className="flex items-center justify-start pb-4 pl-5">
              <h2 className="text-xl font-semibold">
                Continue Watching
              </h2>
            </div>
          }

      <div className="w-full flex items-center justify-center">
        <div className="sm:w-[90%] w-[85%] ">
         
          <Slider {...settings} key={loading ? 'loading' : 'loaded'}>
            {loading
              ? Array(5)
                .fill()
                .map((_, index) => (
                  <div key={index} className="p-4">
                    <SkeletonTheme baseColor="#202020" highlightColor="#444">
                      <Skeleton className="rounded-md" width={200} height={120} />
                      <Skeleton width={180} height={15} className="mt-2" />
                    </SkeletonTheme>
                  </div>
                ))
              : movies.slice().reverse().map((movie) => (
                <div key={movie._id} style={{ paddingLeft: '4px', marginLeft: '8px', marginRight: '8px' }} className="p-4 max-w-[215px] ">

                  <Link href={`/movies/${movie._id}`}>
                    <Image style={{ paddingLeft: '4px' }}
                      className="rounded-lg"
                      src={movie?.mainmovieData[0]?.image}
                      alt={movie?.aboutmovieData?.title || 'Movie Poster'}
                      layout="intrinsic"
                      width={200}
                      height={100}
                      objectFit="cover" // Keeps image aspect ratio
                    />
                    {/* <img
                        className="sm:w-[200px] w-[140px] rounded-lg"
                        src={movie?.mainmovieData[0]?.image}
                        alt={movie?.aboutmovieData?.title || 'Movie Poster'}
                      /> */}


                  </Link>
                  <div style={{ padding: '3px', marginTop: '8px' }} className='flex items-center justify-around w-full '>
                    <h3 style={{ marginLeft: '8px', marginRight: '8px' }} className="text-left w-[90%] mt-2 text-wrap">{movie?.aboutmovieData?.title || 'Untitled'}</h3>
                    <Trash onClick={() => deletecontnuewatch(movie?._id)} style={{ padding: '2px' }} size={30} className=' select-none cursor-pointer text-zinc-500 hover:bg-red-600 rounded-sm  hover:text-white' />
                  </div>
                </div>
              ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Sectionofcontinuewatch;