import React, { useState } from 'react';
import Header from './assets/header/header';
import Body from './assets/body/body';
import Card from './assets/card/card';
import Footer from './assets/footer/footer';

const App = () => {
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

export default App;
