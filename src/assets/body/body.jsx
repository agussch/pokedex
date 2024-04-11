import React, { useState } from 'react';
import "./body.css"

const Body = ({ pokemonData, error }) => {
  return (
    <section className='container'>
        <div className='cards-cont'>
        {pokemonData && (
            <div>
            <h2>{pokemonData.name}</h2>
            <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
            <p>Height: {pokemonData.height}</p>
            <p>Weight: {pokemonData.weight}</p>
            </div>
        )}
        {error && <p>{error}</p>}
        </div>
    </section>
    
  );
};

export default Body;
