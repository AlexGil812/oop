import React, { useState, useEffect, useRef } from 'react';
import '../search.css';



function SearchForm() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef();



   
       
       
    


    useEffect(() => {
        setSuggestions(['New York', 'Times', 'Article', 'News', 'World', 'Business', 'Opinion', 'Tech', 'Science', 'Health']);
    }, []);





    const search = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const response = await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${query}&api-key=${import.meta.env.VITE_API_KEY}`);
        const data = await response.json();
        setResults(data.response.docs);
        setIsLoading(false);
      
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);
    };


          
   







    return (
        <div>
            <form onSubmit={search} className='search-form'>
                <input 
                    type="text" 
                    value={query} 
                    placeholder='Search for articles...'
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }} 
                    ref={inputRef}
                />
                {showSuggestions && (
                    <div className="suggestions">
                        {suggestions.filter(suggestion => suggestion.toLowerCase().includes(query.toLowerCase())).map((suggestion, index) => (
                            <div key={index} className="suggestion" onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
                <button type="submit" className='search-button'>Search</button>
            </form>

            <div className="result-container">
    {isLoading ? (
        <p>Loading...</p>
    ) : (
        results.map((result, index) => (
            <div key={index} className="result-item">
                <h2 className='result-title'>{result.headline.main}</h2>
                <p className='result-snippet'>{result.snippet}</p>
                {result.multimedia && result.multimedia.length > 0 && (
                    <img className="result-image" src={`https://www.nytimes.com/${result.multimedia[0].url}`} alt={result.headline.main} />
                )}
                <a className="result-link" href={result.web_url}>Read more</a>
            </div>
        ))
    )}
</div>
            
        </div>
    );
     }


export default SearchForm;