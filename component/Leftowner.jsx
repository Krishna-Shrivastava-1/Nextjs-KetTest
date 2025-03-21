import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'


const Leftowner = () => {
    const pathname = usePathname();
    return (
        <div className='w-[20%] min-w-[15%] h-screen bg-zinc-950 sticky top-0'>
            
            <div className='flex flex-col items-start justify-center gap-y-1.5'>
                <Link className='w-full' href={'/author'}>
                    <div style={{ padding: '8px' }} className={`${pathname === '/author' && 'bg-zinc-900'} cursor-pointer select-none w-full text-center hover:bg-zinc-900`}>
                        <h2>All Movies</h2>
                    </div>
                </Link>

                <Link className='w-full' href={`/addmovie`}>
                    <div style={{ padding: '8px' }} className={`${pathname.includes('/addmovie') && 'bg-zinc-900'} cursor-pointer select-none w-full text-center hover:bg-zinc-900`}>
                        <h2>Add Movie</h2>
                    </div>
                </Link>
                <Link className='w-full' href={`/addbannerimage`}>
                    <div style={{ padding: '8px' }} className={`${pathname.includes('/addmovie') && 'bg-zinc-900'} cursor-pointer select-none w-full text-center hover:bg-zinc-900`}>
                        <h2>Banner Image Homepage</h2>
                    </div>
                </Link>

            </div>
        </div>
    )
}

export default Leftowner