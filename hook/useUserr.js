import { useState, useEffect } from 'react';
import axios from 'axios';

function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
export default useUser;