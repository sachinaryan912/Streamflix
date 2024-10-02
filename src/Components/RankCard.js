import React from 'react';
import './RankCard.css';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router-dom';

const RankCard = ({ imageSrc, rank, title,id }) => {

  const navigate = useNavigate();
  
  const handleCardClick = async (id) => {
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
  
  return (
    <div className="container1" onClick={()=>{handleCardClick(id)}}>
      <img src={imageSrc} alt={title} />
      <div className="number">{rank}</div>
    </div>
  );
};

export default RankCard;
