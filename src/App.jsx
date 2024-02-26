
import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import SearchForm from './Search/search';

function App() {
  const [articles, setArticles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const cardRef = useRef(null);


  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  }, []);

  const tick = () => {
    setDate(new Date());
  }





  useEffect(() => {
    const handleMouseMove = (event) => {
      const {clientX, clientY} = event;
      const {innerWidth, innerHeight} = window;

      const xPos = (clientX - innerWidth / 2) / 25;
      const yPos = (clientY - innerHeight / 2) / 25;
      cardRef.current.style.transform = `rotateY(${xPos}deg) rotateX(${yPos}deg)`;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  

  
  


  useEffect(() => {
    const toggleVisibility = () => {
      if(window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
      
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []); 

  useEffect(() => {
    fetch(`https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=${import.meta.env.VITE_API_KEY}`)
      .then(response => response.json())
      .then(data => {
        if (data.results) {
          setArticles(data.results);
        } else {
          console.error('Unexpected API response', data);
          if (data.fault) {
            console.error('API fault', data.fault);
          }
        }
      });
  }, []);



  const toggleMenu = () => {
    setIsActive(!isActive);
  }

  return (
    <>
     <nav className="navbar">
        <button onClick={toggleMenu}>
          <div className={`hamburger ${isActive ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <div className={`navbar-links ${isActive ? "active" : ""}`}>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
      </nav>
 

          <div className='clock'>
          <h2>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }).format(date)}</h2>
          </div>

      <SearchForm />

      

      <img src='../src/images/Blindfolded Woman High Res.png' alt='city' className='header-image' />

      <h1>Latest News</h1>
      <div>
        {articles && articles.map((article, index) => {
          const imageUrl = article.media && article.media[0] && article.media[0]['media-metadata'] && article.media[0]['media-metadata'][0] ? article.media[0]['media-metadata'][0].url : '';
          return (
            <div key={index} className="article" ref={cardRef}>
              <h2>{article.title}</h2>
              <p>{article.abstract}</p>
              <a href={article.url}>Read more</a>
              {imageUrl && <img src={imageUrl} alt={article.title} />}
            </div>
          );
        })}
      </div>
      <footer className={`footer ${isVisible ? 'visible' : ''}`}>
        <p>© 2024 My News App</p>
      </footer>
    </>
  );
}

export default App;