import React from 'react';
import { useParams } from 'react-router-dom';

const Card = ({ pokemon }) => {
    const { name } = useParams();
    
    if (!pokemon) {
        return <div>Selecciona un Pokémon para ver los detalles</div>;
    }

    return (
        <div>
            <h3>{pokemon.name}</h3>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>Peso: {pokemon.weight} kg</p>
            <p>Altura: {pokemon.height} m</p>
            <p>Tipos:</p>
            <ul>
                {pokemon.types.map((typeInfo, idx) => (
                    <li key={idx}>{typeInfo.type.name}</li>
                ))}
            </ul>
            {/* Agrega más detalles del Pokémon aquí según tus necesidades */}
        </div>
    );
};

export default Card;
