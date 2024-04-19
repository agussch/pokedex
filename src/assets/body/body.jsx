import React from 'react';
import './body.css';
import { useState, useEffect } from 'react';


const Body = ({ onPokemonSelect }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pokemonsPerPage = 16;

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const offset = (currentPage - 1) * pokemonsPerPage;
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${pokemonsPerPage}`);
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
    }, [currentPage]);

    const goToNextPage = () => {
        if (currentPage < 64) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <section className="container">
            <div className="container-card-gen">
                <div className="cards-cont">
                    {pokemonList.length > 0 ? (
                        pokemonList.map((pokemon, index) => {
                            const typeClasses = pokemon.types.map((typeInfo) => `type-${typeInfo.type.name}`).join(' ');

                            return (
                                <div key={index} className={`pokemon-card ${typeClasses}`} onClick={() => onPokemonSelect(pokemon)}>
                                    {pokemon.sprites && pokemon.sprites.front_default ? (
                                        <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    <div className="cont-pokecard">
                                        <p className="poke-id">N.° {pokemon.id.toString().padStart(4, '0')}</p>
                                        <h2>{pokemon.name}</h2>
                                        <p className="pokecard-type">{pokemon.types.map((typeInfo, idx) => (
                                            <span key={idx} className={`type-${typeInfo.type.name}`}>
                                                {typeInfo.type.name}{idx < pokemon.types.length - 1 ? ' ' : ''}
                                            </span>
                                        ))}</p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No Pokémon data available</p>
                    )}
                    {error && <p>{error}</p>}
                </div>
            </div>
            <div className="pagination">
                <div className="pag-cont">
                    {currentPage > 1 && (
                        <button onClick={goToPreviousPage}>
                            Anterior
                        </button>
                    )}
                    <span>Página {currentPage}</span>
                    {currentPage < 64 && (
                        <button onClick={goToNextPage}>
                            Siguiente
                        </button> 
                    )}
                </div>
            </div>
        </section>
    );
};

export default Body;
