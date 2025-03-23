'use client'; // Mark this component as a client component

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Pencil } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

const Rightowner = () => {
  const [movies, setmovies] = useState([]);

  const [querry, setquerry] = useState('');
  const router = useRouter(); // Use useRouter



  const fetchMovies = async () => {
    try {
      const res = await axios.get('/api/movies/fetchmoviedata'); // Fetch processed movie data
      setmovies(res.data.movies);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const logout = () => {
    localStorage.removeItem('ownertoken');
    router.push('/');
  };

  const deletemovie = async (id, name) => {
    const confirmation = window.confirm(`Really want to Delete movie - ${name}?`);

    if (confirmation) {
      try {
        await axios.delete(`api/movies/deletemovie/${id}`);
        fetchMovies()
        // console.log("deleted");
        // Optionally, you might want to refresh the movie list or provide feedback to the user
      } catch (error) {
        console.error("Error deleting movie:", error);
        // Handle the error appropriately (e.g., show an error message)
      }
    }
  };

  // const merarry = aboutmovies.map((e, index) => ({
  //     ...e,
  //     image: newim[index],
  // }));

  // const filter = merarry.filter((e) => e);
 const movieaboutarray = movies.map((e)=>{
  return {
   aboutdat: e?.aboutmovieData,
   imagedat:e?.mainmovieData[0]?.image,
   ids:e?._id
  }
 })
//  console.log(movieaboutarray)
  const searcher = movieaboutarray.filter((e) =>
      e?.aboutdat?.title?.toLowerCase().trim().includes(querry.toLowerCase())
  );
// console.log(movies)
// console.log(searcher)
  return (
    <div style={{ padding: '4px' }} className="w-full ">
      <div className="flex items-center justify-around">
        <h2>All Movies</h2>
        <input
          className="outline-none border-none bg-zinc-900"
          value={querry}
          onChange={(e) => setquerry(e.target.value)}
          type="search"
        />
        <button className="cursor-pointer" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="w-full " style={{ padding: '12px' }}>
        {querry ?
                    searcher.map((e, index) => (
                        <div key={index} className='w-full flex justify-between items-center gap-2'>
                            <img style={{ margin: "12px" }} className='w-[200px]' src={e?.imagedat} alt="" />
                            <h3>{e?.aboutdat?.title}</h3>
                            <Link href={`/editmovie/${e?.ids}`}>
                                <div style={{ padding: "3px" }} className='bg-sky-700 rounded-md hover:bg-sky-600 cursor-pointer'>
                                    <Pencil />
                                </div>
                            </Link>
                            <div
                onClick={() => deletemovie(e?.ids, e?.aboutdat?.title)}
                style={{ padding: '3px' }}
                className="bg-red-700 rounded-md hover:bg-red-600 cursor-pointer"
              >
                <Trash2 />
              </div>

                           
                        </div>
                    ))
                    :
          movies.map((e, index) => (
            <div key={index} className="w-full flex justify-between items-center gap-2">
              <img style={{ margin: '12px' }} className="w-[200px]" src={movies[index]?.mainmovieData[0].image || movies[index].movieimageurl} alt="" />
              <h3>{e?.aboutmovieData?.title}</h3>
              <Link href={`/editmovie/${movies[index]._id}`}>
                <div style={{ padding: '3px' }} className="bg-sky-700 rounded-md hover:bg-sky-600 cursor-pointer">
                  <Pencil />
                </div>
              </Link>
              <div
                onClick={() => deletemovie(e?._id, e?.aboutmovieData?.title)}
                style={{ padding: '3px' }}
                className="bg-red-700 rounded-md hover:bg-red-600 cursor-pointer"
              >
                <Trash2 />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Rightowner;