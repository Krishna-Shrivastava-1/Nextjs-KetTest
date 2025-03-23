// 'use client';
// import { useEffect } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import axios from 'axios';

// function AuthGuard() {
//   const router = useRouter();
//   const pathname = usePathname();

//   useEffect(() => {
//     const authtoken = localStorage.getItem('authtoken');
//     const ownertoken = localStorage.getItem('ownertoken');

//     const verifyToken = async (token) => {
//       if (token) {
//         try {
//           await axios.get('/api/user', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           });
//         } catch (error) {
//           if (error.response && error.response.status === 401) {
//             localStorage.removeItem('authtoken');
//             localStorage.removeItem('ownertoken');
//             router.push('/login');
//           }
//         }
//       }
//     };

//     if (ownertoken) {
//       if (pathname === '/login') {
//         router.push('/author');
//       }
//       verifyToken(ownertoken);
//     } else if (authtoken) {
//       if (pathname === '/login') {
//         router.push('/home');
//       } else if (
//         pathname.startsWith('/author') ||
//         pathname.startsWith('/addmovie') ||
//         pathname.startsWith('/addbannerimage') ||
//         pathname.startsWith('/editmovie')
//       ) {
//         router.push('/home');
//       }
//       verifyToken(authtoken);
//     } else {
//       if (pathname !== '/login' && pathname !== '/') {
//         router.push('/');
//       }
//     }
//   }, [pathname, router]);

//   return null;
// }

// export default AuthGuard;


'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { useAuth } from "@clerk/nextjs";

function AuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, userId, getToken } = useAuth(); // Clerk authentication

  useEffect(() => {
    const authtoken = localStorage.getItem('authtoken');
    const ownertoken = localStorage.getItem('ownertoken');

    // Function to verify tokens
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

    // Step 1: If user is signed in via Clerk, store an auth token
    const handleClerkAuth = async () => {
      if (isSignedIn && userId) {
        const clerkToken = await getToken(); // Get Clerk session token
        localStorage.setItem('authtoken', clerkToken);
        if (pathname === '/login') {
          router.push('/home');
        }
      }
    };

    // Step 2: Check for authentication flow
    if (isSignedIn && userId) {
      handleClerkAuth();
    } else if (ownertoken) {
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
  }, [pathname, router, isSignedIn, userId, getToken]);

  return null;
}

export default AuthGuard;
