import React, { useState } from 'react';
import Footer from '../Components/Footer';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';





const AISearch = () => {
    const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    if (!inputValue) return;

    // Check if the user wants to play a movie
    if (inputValue.startsWith("play ")) {
      const movieName = inputValue.slice(5);
      await playMovie(movieName);
    } else {
      await searchMovies(inputValue);
    }
  };

  const searchMovies = async (query) => {
    try {
      // Call OpenAI API to interpret the query
      const interpretedQuery = await callOpenAIAPI(query);

      // Fetch movies from TMDB using interpreted query
      const movies = await fetchTMDBMovies(interpretedQuery);
      setMovies(movies);
      setErrorMessage('');
    } catch (error) {
      console.error(error); // Log error for debugging
      setErrorMessage('Error fetching movies. Please try again.');
      setMovies([]);
    }
  };

  
  
  const playmoviedata = async (id) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}/videos`, {
            params: {
                api_key: '1d12479ef172d0b31150a9fc658578fa',
            },
        });

        const trailers = response.data.results.filter(video => video.name.includes("Trailer"));

        const videoKey = trailers.length > 0 ? trailers[0].key : response.data.results[response.data.results.length - 1].key;

        navigate(`/home/watch?key=${videoKey}`);

        console.log(videoKey);
    } catch (error) {
        console.error("Error fetching videos:", error);
    }
  };

  const playMovie = async (movieName) => {
    try {
      // Fetch movie details from TMDB
      const movieDetails = await fetchMovieDetails(movieName);
      console.log("hey sachin");
      
      if (movieDetails) {
        // Redirect to movie player (you'll need to implement the video player)
        console.log(movieDetails.id);
        playmoviedata(movieDetails.id)
        
        // window.location.href = movieDetails.streamURL; // Replace with actual video player URL
      } else {
        setErrorMessage('Movie not found.');
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      setErrorMessage('Error fetching movie details. Please try again.');
    }
  };

  const callOpenAIAPI = async (query) => {
    const maxRetries = 3; // Set the maximum number of retries
    let attempt = 0;
  
    while (attempt < maxRetries) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ', 
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // Change to "gpt-4" if you have access to GPT-4
            messages: [{ role: 'user', content: query }],
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          return data.choices[0].message.content.trim(); // Return the interpreted query
        }
  
        // Check for rate limit errors
        if (response.status === 429) {
          // Too many requests
          console.warn('Rate limit exceeded. Retrying...');
          attempt++;
          const retryAfter = response.headers.get('Retry-After');
          const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2000; // Default wait time of 2 seconds
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          const errorData = await response.json();
          console.error('OpenAI API Error:', errorData);
          throw new Error('Failed to fetch response from OpenAI API');
        }
      } catch (error) {
        console.error('Error during OpenAI API call:', error);
        throw error; // Re-throw the error to be caught by the calling function
      }
    }
  
    throw new Error('Max retries reached. Unable to fetch response from OpenAI API.');
  };
  

  const fetchTMDBMovies = async (query) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=1d12479ef172d0b31150a9fc658578fa`); // Replace with your actual TMDB API key
    const data = await response.json();
    return data.results || []; // Return movie results
  };

  const fetchMovieDetails = async (movieName) => {
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movieName)}&api_key=1d12479ef172d0b31150a9fc658578fa`); // Replace with your actual TMDB API key
    const data = await response.json();
    return data.results.length > 0 ? data.results[0] : null; // Return first movie details
  };

  return (
    <div>
      <Helmet>
        <title>Streamflix-AI</title>
      </Helmet>
      <div className="banner"></div>
      <div className="overlay"></div>
      <div className='absolute-page'>
        <div className='search-box'>
          <img src='../../assets/logos/ai-logo.png' alt="Logo" />
          <p>Write search input to find any movies</p>
          <div className='input-grp'>
            <input 
              placeholder='Stream here...'
              value={inputValue}
              onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Explore</button>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className='movies-list'>
            {movies.length > 0 && (
              <ul>
                {movies.map(movie => (
                  <li key={movie.id}>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                    {movie.poster_path && (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} 
                        alt={movie.title} 
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AISearch;
