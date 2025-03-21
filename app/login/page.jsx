'use client'
import Homepagebackbanner from '@/component/Homepagebackbanner'
import Navbar from '@/component/Navbar'
import axios from 'axios'
import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';
import { useEmail } from '@/component/EmailState'
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import { jwtDecode } from "jwt-decode";
const Loginpage = () => {
      const { email, setEmail } = useEmail();
    const [name, setname] = useState('')
    const [password, setpassword] = useState('')
    const [logger, setlogger] = useState('SignUp')
    const router = useRouter();
    const signup = async (name, email, password) => {
        try {
          await axios.post('/api/auth/register', {
            name,
            email,
            password,
          });
          console.log('registered successfully', name, email);
        } catch (error) {
          console.error(error);
        }
      };
    
      const login = async (email, password) => {
        try {
          const resp = await axios.post('/api/auth/login', {
            email,
            password,
          });
          const token = resp.data.token;
          if (resp.data.owner) {
            localStorage.setItem('ownertoken', token);
            router.push('/author');
          } else {
            localStorage.setItem('authtoken', token);
            router.push('/home');
          }
        } catch (error) {
          console.error(error);
        }
      };
    const handlesubmit = async (e) => {
        e.preventDefault()
        try {
            if (logger === 'SignUp') {
                signup(name, email, password)
            } else {
                login(email, password)
            }
        } catch (error) {
            console.log(error)
        }
    }
  
    return (
        <div>
            <div className='w-full sticky top-0 z-50 bg-black/40 '>
                <Navbar />
            </div>
            <Homepagebackbanner />
            <div className='p-3  w-full h-[90vh] flex items-center justify-center'>
                <div className='z-30 md:w-[60%] w-[90%] text-center '>

                    <div className='w-full flex items-center justify-center ' style={{ margin: '4px' }}>
                        <div style={{ padding: '10px' }} className='md:w-[50%] w-[90%] bg-black/70  shadow-xl shadow-black rounded-sm backdrop-blur-lg '>
                            <h1 style={{ margin: '6px' }} className='text-xl font-extrabold'>{logger}</h1>
                            <form onSubmit={handlesubmit}>
                                <div className='flex-wrap md:flex-nowrap gap-y-2 flex-col flex items-center  justify-center'>
                                    {
                                        logger === 'SignUp' && <input value={name} onChange={(e) => setname(e.target.value)} placeholder='Full name' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="text" className='outline-none  w-full bg-zinc-900/70 text-white text-lg focus-within:border border-red-500 rounded-md' />
                                    }

                                    <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email address' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="email" className='outline-none  w-full bg-zinc-900/70 text-white text-lg  focus-within:border border-red-500 rounded-md' />

                                    <input required value={password} onChange={(e) => setpassword(e.target.value)} placeholder='Password' style={{ padding: '3px', paddingLeft: '10px', paddingRight: '10px' }} type="password" className='outline-none focus-within:border border-red-500 rounded-md w-full bg-zinc-900/70 text-white text-lg ' />
                                    {/* <div style={{ padding: '4px' }} className='text-nowrap bg-red-700 hover:bg-red-600 cursor-pointer select-none  '>Get Started</div> */}
                                </div>
                                {
                                    logger === 'SignUp' ?
                                        <p style={{ marginTop: '10px' }} className='text-left '>Already have an account? <span onClick={() => setlogger('Login')} className='hover:underline cursor-pointer select-none font-extrabold text-red-700'>Login</span></p>
                                        :
                                        <p style={{ marginTop: '10px' }} className='text-left '>Don't have an account? <span onClick={() => setlogger('SignUp')} className='hover:underline cursor-pointer select-none font-extrabold text-red-700'>SignUp</span></p>
                                }
                                {
                                    logger === 'SignUp' ? <button style={{ marginTop: '12px', padding: '5px' }} type='submit' className='bg-red-700 w-full hover:bg-red-600 cursor-pointer'>SignUp</button>
                                        :
                                        <button style={{ marginTop: '12px', padding: '5px' }} type='submit' className='bg-red-700 w-full hover:bg-red-600 cursor-pointer'>Login</button>
                                }

                            </form>
                           
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Loginpage