import React from 'react';
import './body.css';
import "../root/colores-type.css";
import { useState, useEffect } from 'react';

const Body = ({ onPokemonSelect }) => {
    const [pokemonList, setPokemonList] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pokemonsPerPage = 16;
    const totalPages = 64;

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

    const goToPage = (page) => {
        setCurrentPage(page);
        // Desplázate a la parte superior de la página
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Utiliza un desplazamiento suave
        });
    };

    const calculatePageRange = () => {
        const totalPagesToShow = 5;
        const offset = Math.floor(totalPagesToShow / 2);

        let startPage = currentPage - offset;
        let endPage = currentPage + offset;

        if (startPage < 1) {
            startPage = 1;
            endPage = Math.min(startPage + totalPagesToShow - 1, totalPages);
        } else if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - totalPagesToShow + 1, 1);
        }

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
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
                                    {pokemon.sprites && pokemon.sprites.other && pokemon.sprites.other['official-artwork']?.front_default ? (
                                        <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
                                    ) : (
                                        <p>No image available</p>
                                    )}
                                    <div className="cont-pokecard">
                                        <p className="poke-id">N.° {pokemon.id.toString().padStart(4, '0')}</p>
                                        <h2>{pokemon.name}</h2>
                                        <p className="pokecard-type">
                                            {pokemon.types.map((typeInfo, idx) => (
                                                <span key={idx} className={`type-${typeInfo.type.name}`}>
                                                    {typeInfo.type.name}{idx < pokemon.types.length - 1 ? ' ' : ''}
                                                </span>
                                            ))}
                                        </p>
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
                <div className="pagination-cont">
                    {currentPage > 1 && (
                        <button className='btn-ant' onClick={() => goToPage(currentPage - 1)}>
                            <span class="material-symbols-outlined">
                                arrow_back_ios
                            </span>
                        </button>
                    )}

                    {calculatePageRange().map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={page === currentPage ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button className='btn-sig' onClick={() => goToPage(currentPage + 1)}>
                            <span class="material-symbols-outlined">
                                arrow_forward_ios
                            </span>
                        </button>
                    )}
                </div>
            </div>    
        </section>
    );
};

export default Body;
