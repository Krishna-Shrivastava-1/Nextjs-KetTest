'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'; // Import Image from next/image
import ketlgo from '../assets/KETFLIX-3-15-2025.png'; // Make sure the path is correct
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios';
import { Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useEmail } from './EmailState';
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
const Navbar = () => {
    const [jwt, setJwt] = useState(null);
    const clerkuser = useUser().user
    //   console.log(clerkuser.emailAddresses[0].emailAddress)
    //   console.log(clerkuser.imageUrl)
    const { movies } = useEmail()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check if window is defined (client-side)
            const token = localStorage.getItem('authtoken');
            setJwt(token);
        }
    }, []);


    // const [movies, setMovies] = useState([]);
    const [querry, setquerry] = useState('');
    const [paycred, setpaycred] = useState(null); // Initialize paycred as null
    const [user, setuser] = useState(null); // Initialize user as null
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const pathname = usePathname();
    // const allmovies = async () => {
    //     const res = await axios.get('http://localhost:5050/movie/getmovie');
    //     setmovies(res.data);
    // };

    // const allMovies = async () => {
    //     setLoading(true); // Set loading before fetching
    //     try {
    //         const res = await axios.get('/api/movies/fetchmoviedata');
    //         setMovies(res.data.movies);
    //     } catch (error) {
    //         console.error("Error fetching movies:", error);
    //     }
    // };




    // Fetch movies on mount
    // useEffect(() => {
    //     allMovies();

    // }, []);




    // Fetch movies on mount


    // console.log(movies)
    const forfiltmovietitle = movies?.map((e) => {
        return {
            title: e?.aboutmovieData.title ?? "No Title",
            imageuri: e?.mainmovieData[0].image ?? "No image",
            ids: e?._id

        }; // "No Title" if e.title is undefined
    });
    // console.log(forfiltmovietitle)
    const searcher = forfiltmovietitle?.filter((e) => {
        return e.title.toLowerCase().includes(querry.toLowerCase().trim())
    })
    // console.log(searcher)
    // useEffect(() => {
    //     allmovies();
    // }, []);



    useEffect(() => {
        if (jwt) {
            const parts = jwt.split('.');
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(atob(parts[1].replace('-', '+').replace('_', '/')));
                    setpaycred(payload);
                } catch (error) {
                    console.error('Error decoding JWT:', error);
                }
            } else {
                console.error('Invalid JWT format');
            }
        }
    }, [jwt]);

    useEffect(() => {
        const loggeduser = async () => {
            if (paycred && paycred.id) {
                try {
                    const reps = await axios.get(`/api/auth/getuserbyid/${paycred?.id}`);
                    setuser(reps.data);
                } catch (error) {
                    console.error('Error fetching user:', error);
                }
            }
        };
        loggeduser();
    }, [paycred]);
    // console.log(user)
    // const newim = mainmovieurl.map((e) => e.image);

    // const merarry = aboutmovies.map((e, index) => ({
    //     ...e,
    //     image: newim[index],
    //     datid: movies[index]?._id,
    // }));

    // const filter = merarry.filter((e) => e);

    // const searcher = filter.filter((e) => e.title?.toLowerCase().trim().includes(querry.toLowerCase()));

    const { signOut } = useClerk(); // Clerk sign out function

    const logout = async () => {
        try {
            router.replace('/');
            await signOut();
            localStorage.removeItem('authtoken');
            window.location.reload();
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };


    return (
        <div style={{ padding: '4px' }} className='w-full sticky top-0 z-50 p-2 bg-black/40 backdrop-blur-[2px]'>

            <div className={`flex items-center ${pathname === '/login' ? 'justify-center' : 'justify-around'}  w-full p-1`}>
                <div className='w-26 mx-3 cursor-pointer select-none flex'>
                    <Image src={ketlgo} alt="" />
                    {
                        pathname !== '/' && pathname !== '/login' ?
                            <div style={{ marginLeft: '26px' }} className='flex items-center gap-x-2'>
                                <Link href='/home'>
                                    <p style={{ marginLeft: '12px' }} className='select-none cursor-pointer hover:text-zinc-300'>Home</p>
                                </Link>
                                {/* <p style={{ marginLeft: '12px' }} className='select-none cursor-pointer hover:text-zinc-300'>Movies</p>
                                <p style={{ marginLeft: '12px' }} className='select-none cursor-pointer hover:text-zinc-300'>TVSeries </p> */}
                            </div>
                            : null
                    }
                </div>

                <Link href='/login'>
                    {
                        pathname === '/' &&
                        <div style={{ padding: '4px', paddingLeft: '20px', paddingRight: '20px' }} className=' cursor-pointer select-none bg-neutral-800 hover:bg-neutral-700 text-lg font-medium rounded-full'>
                            SignIn
                        </div>
                    }

                </Link>
                {
                    pathname !== '/' && pathname !== '/login' ?
                        <div className='flex items-center justify-around gap-x-3'>
                            <div style={{ padding: '4px' }} className="sm:flex relative hidden group rounded-sm items-center gap-x-2 bg-transparent  p-1">
                                {/* Search Icon */}
                                <label htmlFor='ih'> <Search className="text-zinc-400 cursor-pointer" /></label>


                                {/* Search Input */}
                                <input
                                    id="ih"
                                    type="search"
                                    value={querry}
                                    onChange={(e) => setquerry(e.target.value)}
                                    placeholder="Search..."
                                    className={`transition-all duration-300 ease-in-out outline-none border-none bg-zinc-900/10 text-white px-2 py-1 rounded-sm hidden sm:block 
              ${querry?.length === 0 ? 'w-0' : 'w-[300px]'} group-focus-within:w-[300px]`}
                                />

                                <div className='absolute top-10 scro bg-black/80 backdrop-blur-[2px] shadow-xl  shadow-zinc-900 left-0 max-h-72 overflow-y-auto'>
                                    {
                                        querry && (
                                            searcher?.length > 0 ? ( // Check if searcher array has any items
                                                searcher.map((e, index) => (
                                                    <div style={{ margin: '3px' }} onClick={() => router.push(`/movies/${e.ids}`)} key={index} className='w-full  flex flex-col items-center gap-2'>
                                                        <div className='flex items-center justify-start select-none cursor-pointer hover:bg-neutral-950  w-full'>
                                                            <img style={{ margin: "12px" }} className='w-[200px] rounded-md' src={e.imageuri} alt="" />
                                                            <h3>{e.title}</h3>
                                                        </div>
                                                        <hr />
                                                    </div>
                                                ))
                                            ) : (
                                                <div className='w-full text-center p-4'>No movie found.</div> // Display message if no matches
                                            )
                                        )
                                    }
                                </div>

                            </div>
                            <div onClick={() => router.push('/search')} className='sm:hidden block'><Search className="text-zinc-400 cursor-pointer" /></div>
                            {/* <div  className='relative group'> */}
                            {/* <img className='w-9 select-none cursor-pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKNdKRIgbcMkyGq1cQeq40IA-IQS-FDWnTQ&s" alt="" /> */}
                            {/* <div onClick={()=>setshowpop(true)} style={{ padding: '10px' }} className='bg-zinc-800 hidden transition-all duration-300 group-hover:block absolute -bottom-17 -left-21'>
                                    <p>{user?.user.email}</p>
                                    <p onClick={logout} className='hover:underline cursor-pointer select-none'>Logout</p>
                                </div> */}

                            <DropdownMenu>
                                <DropdownMenuTrigger><Image width={36} height={36} className='w-9 select-none cursor-pointer' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRKNdKRIgbcMkyGq1cQeq40IA-IQS-FDWnTQ&s" alt="" /></DropdownMenuTrigger>
                                <DropdownMenuContent className={`bg-zinc-800 text-zinc-200 border-zinc-700`}>
                                    <DropdownMenuLabel style={{ padding: '4px' }} className={`text-zinc-200`}>My Account</DropdownMenuLabel>
                                    <DropdownMenuSeparator className={`bg-zinc-700`} />
                                    {user ?
                                        <DropdownMenuItem style={{ padding: '4px' }} className="hover:bg-zinc-600 flex items-center justify-around "><div ><p style={{padding:'3px',paddingLeft:'8px',paddingRight:'8px'}} className='rounded-full font-bold bg-sky-700'>{user?.user?.name?.split('')[0].toUpperCase()}</p></div> <p>{user?.user.email}</p></DropdownMenuItem>
                                        :
                                        <DropdownMenuItem style={{ padding: '4px' }} className="hover:bg-zinc-600 flex items-center justify-around "> <img className='w-5 h-5 rounded-full' src={clerkuser?.imageUrl} alt="" /> <p>{clerkuser?.emailAddresses[0]?.emailAddress || 'no'}</p></DropdownMenuItem>
                                    }



                                    <DropdownMenuItem style={{ padding: '4px' }} className="hover:bg-zinc-600 hover:underline cursor-pointer select-none" onClick={logout}><p className=' cursor-pointer select-none'>Logout</p></DropdownMenuItem>
                                    {/* <DropdownMenuItem className="dark:hover:bg-zinc-700">Team</DropdownMenuItem>
    <DropdownMenuItem className="dark:hover:bg-zinc-700">Subscription</DropdownMenuItem> */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {/* </div> */}


                        </div>
                        : null
                }


            </div>
        </div>
    )
}

export default Navbar