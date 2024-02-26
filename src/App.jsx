
import React, { useEffect, useState } from 'react';
import './App.css';
import SearchForm from './Search/search';
import Upset from '../src/images/Upset woman with hands.png'

function App() {
  const [articles, setArticles] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [quote, setQuote] = useState('');
  






  useEffect(() => {
    const fetchQuote = () => {
    fetch('https://api.kanye.rest')
    .then(response => response.json())
    .then(data => setQuote(data.quote));

    }

    fetchQuote();

    const intervalID = setInterval(fetchQuote, 20000);

    return () => clearInterval(intervalID);
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

  return (
    <>
     <nav className="navbar">
  <div className={`navbar-links ${isActive ? "active" : ""}`}>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="#">About</a></li>
      <li><a href="#">Services</a></li>
      <li><a href="#">Contact</a></li>
      <img className='Avatar' src={Upset} />
    </ul>
    <div className='quote'>
      {quote}
    </div>
  </div>
</nav>

      <SearchForm />

   

      <img src='../src/images/Blindfolded Woman High Res.png' alt='city' className='header-image' />

      <h1>Latest News</h1>
      <div>
        {articles && articles.map((article, index) => {
          const imageUrl = article.media && article.media[0] && article.media[0]['media-metadata'] && article.media[0]['media-metadata'][0] ? article.media[0]['media-metadata'][0].url : '';
          return (
            <div key={index} className="article">
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