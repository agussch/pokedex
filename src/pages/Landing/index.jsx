import React, { useState } from 'react';
import Header from './header';
import Body from './body';
import Card from './card';
import Footer from './footer';

const Landing = () => {
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (searchTerm) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
            if (!response.ok) {
                throw new Error('Pokemon not found!');
            }
            const data = await response.json();
            setSelectedPokemon(data);
            setError(null);
        } catch (error) {
            setError('');
            setSelectedPokemon(null);
        }
    };

    const handlePokemonSelect = (pokemon) => {
        setSelectedPokemon(pokemon);
    };

    return (
        <div>
            <Header onSearch={handleSearch} />
            {selectedPokemon ? (
                <Card pokemon={selectedPokemon} />
            ) : (
                <Body onPokemonSelect={handlePokemonSelect} />
            )}
            {error && <p>{error}</p>}
            <Footer/>
        </div>
    );
};

export default Landing;
