import React from 'react';
import './card.css';
import { useParams } from 'react-router-dom';

const Card = ({ pokemon }) => {
    const { name } = useParams();

    if (!pokemon) {
        return <div>Selecciona un Pokémon para ver los detalles</div>;
    }

    // Extraer información del Pokémon
    const { height, weight, abilities, stats, types, species, sprites } = pokemon;

    // Extraer la habilidad principal (si hay varias, se toma la primera)
    const mainAbility = abilities && abilities.length > 0 ? abilities[0].ability.name : 'Desconocida';

    // Extraer los puntos de base
    const baseStats = {
        hp: stats?.find(stat => stat.stat.name === 'hp')?.base_stat ?? 'Desconocido',
        attack: stats?.find(stat => stat.stat.name === 'attack')?.base_stat ?? 'Desconocido',
        defense: stats?.find(stat => stat.stat.name === 'defense')?.base_stat ?? 'Desconocido',
        specialAttack: stats?.find(stat => stat.stat.name === 'special-attack')?.base_stat ?? 'Desconocido',
        specialDefense: stats?.find(stat => stat.stat.name === 'special-defense')?.base_stat ?? 'Desconocido',
        speed: stats?.find(stat => stat.stat.name === 'speed')?.base_stat ?? 'Desconocido',
    };

    // Extraer la categoría del Pokémon
    const category = species?.genera?.find(genera => genera.language.name === 'en')?.genus || 'Desconocido';

    // Calcular debilidades según los tipos
    const getWeaknesses = (types) => {
        const typeWeaknesses = {
            normal: ['fighting'],
            fire: ['water', 'ground', 'rock'],
            water: ['electric', 'grass'],
            grass: ['fire', 'ice', 'flying', 'bug', 'poison'],
            electric: ['ground'],
            ice: ['fire', 'fighting', 'rock', 'steel'],
            fighting: ['flying', 'psychic', 'fairy'],
            poison: ['ground', 'psychic'],
            ground: ['water', 'ice', 'grass'],
            flying: ['electric', 'rock', 'ice'],
            psychic: ['bug', 'ghost', 'dark'],
            bug: ['fire', 'flying', 'rock'],
            rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
            ghost: ['ghost', 'dark'],
            dragon: ['ice', 'dragon', 'fairy'],
            dark: ['fighting', 'bug', 'fairy'],
            steel: ['fire', 'fighting', 'ground'],
            fairy: ['poison', 'steel']
        };

        const weaknesses = [];
        types.forEach(typeInfo => {
            const type = typeInfo.type.name;
            weaknesses.push(...typeWeaknesses[type] || []);
        });
        return [...new Set(weaknesses)]; // Eliminar duplicados
    };

    const weaknesses = getWeaknesses(types);

    return (
        <div className='card-jsx'>
            <h3>{name}</h3>
            <img src={sprites?.front_default} alt={name} />
            <p>Peso: {weight} kg</p>
            <p>Altura: {height} m</p>
            <p>Sexo: {species?.gender_rate === -1 ? 'Desconocido' : 'Femenino/Masculino'}</p>
            <p>Habilidad: {mainAbility}</p>
            <p>Categoría: {category}</p>
            <p>Puntos de base:</p>
            <ul>
                <li>PS: {baseStats.hp}</li>
                <li>Ataque: {baseStats.attack}</li>
                <li>Defensa: {baseStats.defense}</li>
                <li>Ataque especial: {baseStats.specialAttack}</li>
                <li>Defensa especial: {baseStats.specialDefense}</li>
                <li>Velocidad: {baseStats.speed}</li>
            </ul>
            <p>Tipos:</p>
            <ul>
                {types?.map((typeInfo, idx) => (
                    <li key={idx}>{typeInfo.type.name}</li>
                ))}
            </ul>
            <p>Debilidades:</p>
            <ul>
                {weaknesses?.map((weakness, idx) => (
                    <li key={idx}>{weakness}</li>
                ))}
            </ul>
        </div>
    );
};

export default Card;
