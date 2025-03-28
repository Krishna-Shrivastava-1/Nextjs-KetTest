
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

const SectionofCards = ({ maintit }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch movies
  const allMovies = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/movies/fetchmoviedata');

      if (res.data && res.data.movies) {
        setMovies(res.data.movies);
        setLoading(false);
      } else {
        console.error('Movies data is missing in response:', res.data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allMovies();
  }, []);

  // Filter movies based on genre
  const filteredMovies = movies.filter((movie) => {
    const genres = movie?.aboutmovieData?.genre?.split(',').map((g) => g.trim()) || [];
    return genres.includes(maintit);
  });

  // console.log('Filtered Movies:', filteredMovies);
  // console.log('All Movies:', movies);

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

  return (
    <div className="w-full p-4">
      <div style={{ paddingLeft: '30px', margin: '10px' }} className="flex items-center justify-start pb-4 pl-5">
        <h2 className="text-xl font-semibold">
          {maintit} {maintit?.includes('Documentary') ? null : 'movies'}
        </h2>
      </div>

      <div className="w-full flex items-center justify-center">
        <div className="sm:w-[90%] w-[85%]">
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
              : filteredMovies.reverse().map((movie) => (
                  <div key={movie._id} style={{paddingLeft:'4px',marginLeft:'8px',marginRight:'8px'}} className="p-4 max-w-[215px] ">
                    <Link href={`/movies/${movie._id}`}>
                    <Image style={{paddingLeft:'4px'}}
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
                      <h3 style={{marginLeft:'8px',marginRight:'8px'}} className="text-left mt-2 text-wrap">{movie?.aboutmovieData?.title || 'Untitled'}</h3>
                    </Link>
                  </div>
                ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default SectionofCards;