import React from 'react';
import './body.css';

const Body = ({ pokemonList, searchedPokemon, error }) => {
    const displayedPokemon = searchedPokemon ? [searchedPokemon] : pokemonList;

    return (
        <section className="container">
          <div className="container-card-gen">
            <div className="cards-cont">
                {displayedPokemon.length > 0 ? (
                    displayedPokemon.map((pokemon, index) => (
                        <div key={index} className="pokemon-card">
                            <h2>{pokemon.name}</h2>
                            {pokemon.sprites && pokemon.sprites.front_default ? (
                                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                            ) : (
                                <p>No image available</p>
                            )}
                            {/* Mostrar el número de identificación formateado */}
                            <p>N.° {pokemon.id.toString().padStart(4, '0')}</p>
                            {/* Mostrar los tipos del Pokémon */}
                            <p>{pokemon.types.map((typeInfo, idx) => (
                                <span key={idx}>{typeInfo.type.name}{idx < pokemon.types.length - 1 ? ', ' : ''}</span>
                            ))}</p>
                        </div>
                    ))
                ) : (
                    <p>No Pokémon data available</p>
                )}
                {error && <p>{error}</p>}
            </div>
          </div>
        </section>
    );
};

export default Body;
