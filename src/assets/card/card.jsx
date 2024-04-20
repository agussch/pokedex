import React, { useState, useEffect } from 'react';
import './card.css';
import { useParams } from 'react-router-dom';
import Chart from 'chart.js/auto';

const Card = ({ pokemon }) => {
    const { name } = useParams();

    // Estados para la cadena de evolución, las imágenes de evolución, los IDs de los Pokémon y la descripción
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [evolutionImages, setEvolutionImages] = useState({});
    const [evolutionIds, setEvolutionIds] = useState({});
    const [description, setDescription] = useState(''); // Estado para almacenar la descripción en español
    const [pokemonGender, setPokemonGender] = useState(null); // Estado para almacenar el género del Pokémon
    const [chartRef, setChartRef] = useState(null); // Estado para almacenar la referencia del canvas del gráfico

    // Efecto para obtener la cadena de evolución, las imágenes, los IDs de cada Pokémon, la descripción y el género cuando el Pokémon cambia
    useEffect(() => {
        const fetchData = async () => {
            if (!pokemon) return;

            try {
                // Obtén la URL de la especie del Pokémon
                const speciesUrl = pokemon.species.url;
                const speciesResponse = await fetch(speciesUrl);
                const speciesData = await speciesResponse.json();

                // Obtén la descripción en español
                const descriptionEntry = speciesData.flavor_text_entries.find(
                    entry => entry.language.name === 'es'
                );
                const description = descriptionEntry ? descriptionEntry.flavor_text : 'Sin descripción en español';

                // Almacena la descripción en español en el estado
                setDescription(description);

                // Obtén la información del género
                const genderResponse = await fetch(`https://pokeapi.co/api/v2/gender/${speciesData.gender_rate}/`);
                const genderData = await genderResponse.json();
                setPokemonGender(genderData);

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
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [pokemon]);

    // Efecto para crear el gráfico cuando el componente se monta o cuando cambia el Pokémon
    useEffect(() => {
        // Verifica si hay una referencia de gráfico
        if (!chartRef) return;

        // Verifica si hay un Pokémon
        if (!pokemon) return;

        // Obtiene las estadísticas base del Pokémon
        const { hp, attack, defense, specialAttack, specialDefense, speed } = pokemon.stats.reduce((acc, stat) => {
            acc[stat.stat.name] = stat.base_stat;
            return acc;
        }, {});

        // Configuración de los datos del gráfico
        const data = {
            labels: ['PS', 'Ataque', 'Defensa', 'Ataque especial', 'Defensa especial', 'Velocidad'],
            datasets: [{
                label: 'Puntos Base',
                data: [hp, attack, defense, specialAttack, specialDefense, speed],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        // Configuración de las opciones del gráfico
        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        // Crea el gráfico
        const myChart = new Chart(chartRef, {
            type: 'bar',
            data: data,
            options: options
        });

        // Devuelve una función de limpieza para eliminar el gráfico cuando el componente se desmonte o cuando cambie el Pokémon
        return () => {
            myChart.destroy();
        };
    }, [pokemon, chartRef]);

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
            <div className="cont-card-gen">
                <div className="tittle-cont">
                    <h3>{pokemon.name}</h3>
                    <p>id: {pokemon.id}</p>
                </div>
                <div className="details-cont">
                    <div className="img-peso-cont">
                        <div className="img-cont">
                            <img src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
                        </div>
                        <div className="peso-cont">
                            <div className="description-cont">
                                <p>{description}</p>
                            </div>
                            
                            <div className="peso">
                                <div className="column1">
                                    <div className='bot-flex'><p>Peso:</p> <span>{weight} kg</span></div>
                                    <div className='bot-flex'><p>Altura:</p> <span>{height} m</span></div>
                                    <div className='bot-flex'>
                                        <p>Género:</p>
                                        <span>
                                            <img src='../../../public/img/femenino-logo.png' alt="Femenino"/>
                                            <img src='../../../public/img/masculino-logo.png' alt="Masculino"/>
                                        </span>
                                    </div>
                                </div>
                                <div className="column2">
                                    <div className='bot-flex'><p>Habilidad:</p> <span>{mainAbility}</span></div>
                                    <div className='bot-flex'><p>Categoría:</p> <span>{category}</span></div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="cont-dot-graphs">
                        <canvas ref={setChartRef}></canvas>
                    </div>
                    <div className="types-cont">
                        <p>Tipos:</p>
                        <ul>
                            {types?.map((typeInfo, idx) => (
                                <li key={idx}>{typeInfo.type.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="weaknesses">
                        <p>Debilidades:</p>
                        <ul>
                            {weaknesses?.map((weakness, idx) => (
                                <li key={idx}>{weakness}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p>Cadena de evolución:</p>
                        {evolutionChain && (
                            <ul>
                                {renderEvolutionChain(evolutionChain)}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    function renderEvolutionChain(chain) {
        const renderChain = (node) => {
            return (
                <div className="evolution-chain">
                    <li key={node.species.name}>
                        <img src={evolutionImages[node.species.name]} alt={node.species.name} />
                        {node.species.name} ID: {evolutionIds[node.species.name]}
                        {node.evolves_to.length > 0 && (
                            <ul>
                                {node.evolves_to.map(childNode => renderChain(childNode))}
                            </ul>
                        )}
                    </li>
                </div>
            );
        };
        return renderChain(chain);
    }
};

export default Card;
