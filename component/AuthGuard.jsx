'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';

function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const authtoken = localStorage.getItem('authtoken');
    const ownertoken = localStorage.getItem('ownertoken');

    const verifyToken = async (token) => {
      if (token) {
        try {
          await axios.get('/api/user', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          if (error.response && error.response.status === 401) {
            localStorage.removeItem('authtoken');
            localStorage.removeItem('ownertoken');
            router.push('/login');
          }
        }
      }
    };

    if (ownertoken) {
      if (pathname === '/login') {
        router.push('/author');
      }
      verifyToken(ownertoken);
    } else if (authtoken) {
      if (pathname === '/login') {
        router.push('/home');
      } else if (
        pathname.startsWith('/author') ||
        pathname.startsWith('/addmovie') ||
        pathname.startsWith('/addbannerimage') ||
        pathname.startsWith('/editmovie')
      ) {
        router.push('/home');
      }
      verifyToken(authtoken);
    } else {
      if (pathname !== '/login' && pathname !== '/') {
        router.push('/');
      }
    }
  }, [pathname, router]);

  return null;
}

export default AuthGuard;