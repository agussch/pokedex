import React, { useState, useEffect } from 'react';
import './header.css';

const Header = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const fetchSuggestions = async (term) => {
        if (term.trim() === '') {
            setSuggestions([]);
            return;
        }
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
            const data = await response.json();

            if (response.ok) {
                const filteredSuggestions = data.results.filter(pokemon =>
                    pokemon.name.toLowerCase().includes(term.toLowerCase()) ||
                    pokemon.url.includes(term.toLowerCase())
                );
                
                setSuggestions(filteredSuggestions);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            setSuggestions([]);
        }
    };
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        clearTimeout(debounceTimeout); 
        setDebounceTimeout(setTimeout(() => {
            fetchSuggestions(term);
        }, 150));
    };

    const handleSuggestionClick = (pokemon) => {
      setSearchTerm(pokemon.name);
      setSuggestions([]); 
      setShowSuggestions(false);
      onSearch(pokemon.name);
    };

    return (
        <header>
            <div className="search-logo">
                <a href="/">
                    <h3>Agustin.dev</h3>
                </a>
            </div>
            <div className="search">
                
                <div className="cont-search">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search Pokemon"
                            className="search-input"
                            onFocus={() => setShowSuggestions(true)}
                        />
                        <button onClick={() => onSearch(searchTerm)} className="search-btn">
                            Search
                        </button>
                    </div>
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="suggestions">
                            {suggestions.map((pokemon) => (
                                <li key={pokemon.name} onClick={() => handleSuggestionClick(pokemon)}>
                                    {pokemon.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <span className="logoapi">
                    <img src="../public/img/pokeapilogo.png" alt="PokeAPI logo" />
                </span>
            </div>
        </header>
    );
};

export default Header;
