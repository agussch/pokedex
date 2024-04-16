import React, { useState, useEffect } from 'react';
import Body from './assets/body/body';
import Header from './assets/header/header';

const App = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [searchedPokemon, setSearchedPokemon] = useState(null);
    const [error, setError] = useState(null);

    // Fetch la lista completa de Pokémon cuando el componente se monta
    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20');
                if (!response.ok) {
                    throw new Error('Failed to fetch Pokémon data');
                }
                const data = await response.json();
                const promises = data.results.map(async (pokemon) => {
                    const response = await fetch(pokemon.url);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch data for ${pokemon.name}`);
                    }
                    return response.json();
                });
                const pokemonData = await Promise.all(promises);
                setPokemonList(pokemonData);
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                setError('Failed to fetch Pokémon data');
            }
        };

        fetchPokemonList();
    }, []);

    // Función para buscar un Pokémon específico
    const fetchPokemon = async (searchTerm) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm}`);
            if (!response.ok) {
                throw new Error('Pokemon not found!');
            }
            const data = await response.json();
            setSearchedPokemon(data);
            setError(null);
        } catch (error) {
            setError('Pokemon not found!');
            setSearchedPokemon(null);
        }
    };

    return (
        <div>
            <Header onSearch={fetchPokemon} />
            <Body pokemonList={pokemonList} searchedPokemon={searchedPokemon} error={error} />
        </div>
    );
};

export default App;
