import React from 'react'
import SpotlightCard from './Spotlight'
// import reason from './../../morereson.json'
import { CirclePlay } from 'lucide-react';
import { LockKeyhole } from 'lucide-react';
import { MonitorSmartphone } from 'lucide-react';
import { HandHeart } from 'lucide-react';
const Morereson = () => {
  const data = [
    {
      "id": "0",
      "description": "Stream your desired movies as you want, anytime, anywhere.",
      "icon": CirclePlay
    },
    {
      "id": "1",
      "description": "A safe place to watch anything, with your privacy protected.",
      "icon": LockKeyhole

    },
    {
      "id": "2",
      "description": "Watch on your favourite devices, seamlessly across all platforms.",
      "icon": MonitorSmartphone

    },
    {
      "id": "3",
      "description": "Stories tailored to your taste, with intelligent recommendations.",
      "icon": HandHeart

    }
  ]
  return (
    <div style={{ margin: '8px', marginTop: '30px' }} className=''>
      <h2 style={{ marginBottom: '20px' }} className='font-semibold text-2xl'>More reason to join</h2>
      <div style={{padding:'10px'}} className='w-full flex gap-2 items-center justify-around  md:flex-nowrap flex-wrap'>
        {
          data.map((e) => (
            <div key={e.id}>
              <SpotlightCard style={{ padding: '5px' }} className="max-h-26 md:block flex max-w-[350px] md:w-auto custom-spotlight-card rounded-md" spotlightColor="rgba(255, 255, 255, 0.25)">
                <p className='w-full text-balance'>{e.description}</p>
                <div style={{ marginRight: '10px' }} className='w-full flex items-center justify-end'>
                  <e.icon  className='text-xl' />
                </div>
              </SpotlightCard>
            </div>
          ))
        }
      </div>

    </div>
  )
}

export default Morereson