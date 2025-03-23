// app/components/EmailState.jsx ('use client')
'use client';
import axios from 'axios';
import React, { useState, createContext, useContext, useEffect } from 'react';

const EmailContext = createContext();

export const EmailProvider = ({ children }) => {
  const [email, setEmail] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const allMovies = async () => {
    setLoading(true); // Set loading before fetching
    try {
      const res = await axios.get('/api/movies/fetchmoviedata');
      setMovies(res.data.movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  // Fetch movies on mount
  useEffect(() => {
    allMovies();

  }, []);
  return (
    <EmailContext.Provider value={{ email, setEmail, movies, loading, setLoading }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => useContext(EmailContext);