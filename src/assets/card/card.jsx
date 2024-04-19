import React, { useState, useEffect } from 'react';
import './card.css';
import { useParams } from 'react-router-dom';

const Card = ({ pokemon }) => {
    const { name } = useParams();

    // Estados para la cadena de evolución y las imágenes de evolución
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [evolutionImages, setEvolutionImages] = useState({});
    const [evolutionIds, setEvolutionIds] = useState({});

    // Efecto para obtener la cadena de evolución, las imágenes y los IDs de cada Pokémon cuando el Pokémon cambia
    useEffect(() => {
        const fetchEvolutionChainAndImagesAndIds = async () => {
            if (!pokemon) return;

            try {
                // Obtén la URL de la cadena de evolución
                const speciesUrl = pokemon.species.url;
                const speciesResponse = await fetch(speciesUrl);
                const speciesData = await speciesResponse.json();

                // Obtén la URL de la cadena de evolución
                const evolutionUrl = speciesData.evolution_chain.url;
                const evolutionResponse = await fetch(evolutionUrl);
                const evolutionData = await evolutionResponse.json();

                // Almacena la cadena de evolución en el estado
                setEvolutionChain(evolutionData.chain);

                // Obtén las imágenes y los IDs de los Pokémon en la cadena de evolución
                const fetchEvolutionImagesAndIds = async (chain) => {
                    let images = {};
                    let ids = {};
                    const fetchPokemonData = async (speciesName) => {
                        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${speciesName}/`);
                        const pokemonData = await pokemonResponse.json();
                        return {
                            image: pokemonData.sprites.other['official-artwork'].front_default,
                            id: pokemonData.id,
                        };
                    };
                    const processChain = async (node) => {
                        const { image, id } = await fetchPokemonData(node.species.name);
                        images[node.species.name] = image;
                        ids[node.species.name] = id;
                        for (const childNode of node.evolves_to) {
                            await processChain(childNode);
                        }
                    };
                    await processChain(chain);
                    return { images, ids };
                };

                const { images, ids } = await fetchEvolutionImagesAndIds(evolutionData.chain);
                setEvolutionImages(images);
                setEvolutionIds(ids);
            } catch (error) {
                console.error('Error fetching evolution chain, images, or IDs:', error);
            }
        };

        fetchEvolutionChainAndImagesAndIds();
    }, [pokemon]);

    if (!pokemon) {
        return <div>Selecciona un Pokémon para ver los detalles</div>;
    }

    const { height, weight, abilities, stats, types, species, sprites } = pokemon;
    const mainAbility = abilities && abilities.length > 0 ? abilities[0].ability.name : 'Desconocida';
    const baseStats = {
        hp: stats?.find(stat => stat.stat.name === 'hp')?.base_stat ?? 'Desconocido',
        attack: stats?.find(stat => stat.stat.name === 'attack')?.base_stat ?? 'Desconocido',
        defense: stats?.find(stat => stat.stat.name === 'defense')?.base_stat ?? 'Desconocido',
        specialAttack: stats?.find(stat => stat.stat.name === 'special-attack')?.base_stat ?? 'Desconocido',
        specialDefense: stats?.find(stat => stat.stat.name === 'special-defense')?.base_stat ?? 'Desconocido',
        speed: stats?.find(stat => stat.stat.name === 'speed')?.base_stat ?? 'Desconocido',
    };

    const category = species?.genera?.find(genera => genera.language.name === 'en')?.genus || 'Desconocido';

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
        return [...new Set(weaknesses)];
    };

    const weaknesses = getWeaknesses(types);

    return (
        <div className='card-jsx'>
            <h3>{pokemon.name}</h3>
            <p>id: {pokemon.id}</p>
            <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
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
            
            <div className="evolution-chain">
                <p>Cadena de evolución:</p>
                {evolutionChain && (
                    <ul>
                        {/* Recorre la cadena de evolución y muestra los Pokémon junto con sus imágenes y IDs */}
                        {renderEvolutionChain(evolutionChain)}
                    </ul>
                )}
            </div>
        </div>
    );

    function renderEvolutionChain(chain) {
        // Función para recorrer la cadena de evolución y mostrar los Pokémon junto con sus imágenes e IDs
        const renderChain = (node) => {
            return (
                <li key={node.species.name}>
                    <img src={evolutionImages[node.species.name]} alt={node.species.name} />
                    {node.species.name} (ID: {evolutionIds[node.species.name]})
                    {node.evolves_to.length > 0 && (
                        <ul>
                            {node.evolves_to.map(childNode => renderChain(childNode))}
                        </ul>
                    )}
                </li>
            );
        };
        return renderChain(chain);
    }
};

export default Card;
