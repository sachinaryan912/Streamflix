import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RankCard from '../Components/RankCard';
import DB from '../Database/LocalDB.json';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';
import { useTranslation } from 'react-i18next'; // Import useTranslation hook
import "react-horizontal-scrolling-menu/dist/styles.css";
import Footer from '../Components/Footer';
import { Helmet } from 'react-helmet';
import {TextField} from '@mui/material';
import {Button} from '@mui/material';
import { auth } from '../Database/firebaseConfig'; // Adjust the path as necessary
import { fetchSignInMethodsForEmail } from 'firebase/auth';
import AccordionUsage from '../Components/FAQ';

const LandingPage = () => {

  const [movies, setMovies] = useState([]);
  const faqList = [
    { question: 'What is Streamflix?', answer: "Streamflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices.\nYou can watch as much as you want, whenever you want, without a single ad – all for one low monthly price. There's always something new to discover, and new TV shows and movies are added every week!" },
    { question: 'How much does Streamflix cost?', answer: 'Watch Streamflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹149 to ₹649 a month. No extra costs, no contracts.' },
    { question: 'Where can i watch?', answer: "Watch anywhere, anytime. Sign in with your Streamflix account to watch instantly on the web at Streamflix.com from your personal computer or on any internet-connected device that offers the Streamflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.\nYou can also download your favourite shows with the iOS or Android app. Use downloads to watch while you're on the go and without an internet connection. Take Streamflix with you anywhere." },
    { question: 'How do i cancel?', answer: 'Streamflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.' },
    { question: 'is Streamflix good for kids?', answer: "The Streamflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and films in their own space.\nKids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see." },
  ];


  useEffect(() => {
    const fetchMovies = async () => {
      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/top_rated',
        { params: { api_key: '1d12479ef172d0b31150a9fc658578fa', language: 'en-US', page: 1 } }
      );
      setMovies(response.data.results.slice(0, 10));  // Get top 10 movies
    };
    fetchMovies();
  }, []);

  const { t, i18n } = useTranslation(); 
  const navigate = useNavigate();
  const landing_page_movie_ranks = DB.landing_page_movie_ranks;

  const [selected, setSelected] = React.useState([]);

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(''); 
  };

  const handleGetStarted = async () => {
    console.log("hey");
    if (!email) {
        setError('Email is required.');
        return;
    }

    console.log(`Checking email: ${email}`);

    try {
        console.log('Fetching sign-in methods...');
        const signInMethods = await fetchSignInMethodsForEmail(auth, email); 
        console.log(`Sign-in methods for ${email}:`, signInMethods);

        if (signInMethods.length > 0) {
            console.log(`Email is already registered: ${email}`);
            navigate(`/signin`);
        } else {
            console.log(`Email is not registered: ${email}`);
            localStorage.setItem('userEmail', email);
            navigate(`/startregistration`);
        }
    } catch (error) {
        console.error('Error fetching sign-in methods:', error);
        setError('An error occurred. Please try again later.');
    }
};

  
  

  const isItemSelected = (id) => !!selected.find((el) => el === id);

  const handleClick = (id) => ({ getItemById, scrollToItem }) => {
    const itemSelected = isItemSelected(id);

    setSelected((currentSelected) =>
      itemSelected
        ? currentSelected.filter((el) => el !== id)
        : currentSelected.concat(id)
    );
  };

  const handleSignInClick = () => {
    navigate('/signin');
  };

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value); 
  };

  return (
    <div className="">
      <Helmet>
        <title>Streamflix India – Watch TV Shows Online, Watch Movies Online</title>
      </Helmet>
        <div className="banner"></div>
        <div className="overlay"></div>
        <div className='absolute-page'>
            <div className='nav'>
                <img src='../../assets/images/logo.png' className='logo'></img>

                <div className="">
                
                
                    <select className="lang-drop" onChange={handleLanguageChange}>
                        <option value="en"><i className="fas fa-globe"></i> English</option>
                        <option value="hi"><i className="fas fa-globe"></i> हिंदी</option>
                    </select>
                    

                    <button className="signIn-btn" onClick={handleSignInClick}>{t('signIn')}</button>
                </div>
            </div>
            <div className="center-data">
                <h1 className="">{t('title')}</h1>
                <p className="p1">{t('description')}</p>
                <p className="p2">{t('prompt')}</p>
                <div className="">
                <TextField
        id="filled-basic"
        label="Email Address"
        variant="filled"
        value={email}
        onChange={handleEmailChange}
        InputProps={{
          disableUnderline: true,
        }}
        sx={{
          width: '30vw',
          marginRight: '10px',
          height: '55px',
          marginBottom: '20px',
          backgroundColor: 'rgba(94, 96, 106, 0.301)',
          color: 'white',
          '& .MuiInputBase-input': {
            color: 'white',
          },
          '& .MuiFilledInput-root': {
            border: '1px solid gray',
            borderRadius: '4px',
            height: '100%',
          },
          '& .MuiInputLabel-root': {
            color: 'gray',
          },
          '& .MuiFilledInput-root:hover': {
            backgroundColor: 'rgba(94, 96, 106, 0.301)',
          },
          '& .MuiFilledInput-root.Mui-focused': {
            borderColor: 'green',
          },
        }}
        error={!!error}
        helperText={error} // Show error message if present
      />
      <button className="get-started-btn" onClick={handleGetStarted}>Get Started <i className="fa-solid fa-chevron-right"></i></button>
                    {/* <input type="email" placeholder={t('emailPlaceholder')} className="email-box" /> */}
                    
                </div>
            </div>
        </div>

        <div className='section2'>
          <div className='curved'>
            <img src='../../assets/logos/curved_bg.png'></img>
          </div>

          <div className='section2-data'>
            <h2>{t('trendingNow')}</h2>
            <div >
              <ScrollMenu LeftArrow={LeftArrow} RightArrow={RightArrow}>
                {movies.map((item, index) => (
                  <RankCard
                    key={index}
                    itemId={index + 1}
                    imageSrc={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    title={item.title}
                    rank={index + 1}
                    onClick={handleClick(item.rank)}
                    selected={isItemSelected(item.rank)}
                  />
                ))}
              </ScrollMenu>
            </div>
          </div>
        </div>

        <div className='faq'>
          <h2>Frequently Asked Questions</h2>

        <AccordionUsage faqList={faqList} />

        </div>

        

        <Footer />
    </div>
  );
};

const LeftArrow = () => {
  const visibility = React.useContext(VisibilityContext);

  return (
    <button onClick={() => visibility.scrollPrev()} className="left-arrow">
      <i className="fa-solid fa-chevron-left"></i>
    </button>
  );
};

const RightArrow = () => {
  const visibility = React.useContext(VisibilityContext);

  return (
    <button onClick={() => visibility.scrollNext()} className="right-arrow">
      <i className="fa-solid fa-chevron-right"></i>
    </button>
  );
};

export default LandingPage;
