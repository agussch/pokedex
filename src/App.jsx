import React, { useState } from 'react';
import Body from './assets/body/body';
import Header from './assets/header/header';

const App = () => {
  const [pokemonData, setPokemonData] = useState(null);
  const [error, setError] = useState(null);

  const fetchPokemon = async (searchTerm) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
      if (!response.ok) {
        throw new Error('Pokemon not found!');
      }
      const data = await response.json();
      setPokemonData(data);
      setError(null);
    } catch (error) {
      setError('Pokemon not found!');
      setPokemonData(null);
    }
  };

  return (
    <div>
      <Header onSearch={fetchPokemon} />
      <Body pokemonData={pokemonData} error={error} />
    </div>
  );
};

export default App;
