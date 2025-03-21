'use client'


import React from 'react'

import Leftowner from '@/component/Leftowner'
import Rightowner from '@/component/Rightowner'
import AddOwnermovie from '@/component/AddOwnermovie'
import { usePathname } from 'next/navigation'

const Ownerpage = () => {
  const pathname = usePathname();
  return (
    <div className='flex w-full items-start h-screen overflow-y-auto '>

      <Leftowner />
      {
        pathname === '/author' ?
          <Rightowner />
          :
          <AddOwnermovie />
      }


    </div>
  )
}

export default Ownerpage