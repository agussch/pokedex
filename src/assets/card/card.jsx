import React, { useState, useEffect } from 'react';
import './card.css';
import "../root/colores-type.css"
import { useParams , Link} from 'react-router-dom';
import Chart from 'chart.js/auto';

const Card = ({ pokemon }) => {
    const { name } = useParams();
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [evolutionImages, setEvolutionImages] = useState({});
    const [evolutionIds, setEvolutionIds] = useState({});
    const [description, setDescription] = useState('');
    const [chartRef, setChartRef] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            if (!pokemon) return;

            try {
                const speciesUrl = pokemon.species.url;
                const speciesResponse = await fetch(speciesUrl);
                const speciesData = await speciesResponse.json();

                const descriptionEntry = speciesData.flavor_text_entries.find(
                    entry => entry.language.name === 'es'
                );
                const description = descriptionEntry ? descriptionEntry.flavor_text : 'Sin descripción en español';

                setDescription(description);

                const evolutionUrl = speciesData.evolution_chain.url;
                const evolutionResponse = await fetch(evolutionUrl);
                const evolutionData = await evolutionResponse.json();

                setEvolutionChain(evolutionData.chain);

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

    useEffect(() => {
        if (!chartRef) return;

        if (!pokemon) return;

        const baseStats = {
            hp: 'Desconocido',
            attack: 'Desconocido',
            defense: 'Desconocido',
            specialAttack: 'Desconocido',
            specialDefense: 'Desconocido',
            speed: 'Desconocido',
        };

        pokemon.stats.forEach(stat => {
            switch (stat.stat.name) {
                case 'hp':
                    baseStats.hp = stat.base_stat;
                    break;
                case 'attack':
                    baseStats.attack = stat.base_stat;
                    break;
                case 'defense':
                    baseStats.defense = stat.base_stat;
                    break;
                case 'special-attack':
                    baseStats.specialAttack = stat.base_stat;
                    break;
                case 'special-defense':
                    baseStats.specialDefense = stat.base_stat;
                    break;
                case 'speed':
                    baseStats.speed = stat.base_stat;
                    break;
                default:
                    break;
            }
        });

        const data = {
            labels: ['PS', 'Ataque', 'Defensa', 'Ataque especial', 'Defensa especial', 'Velocidad'],
            datasets: [{
                label: 'Puntos Base',
                data: [
                    baseStats.hp,
                    baseStats.attack,
                    baseStats.defense,
                    baseStats.specialAttack,
                    baseStats.specialDefense,
                    baseStats.speed
                ],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)', // PS
                    'rgba(54, 162, 235, 0.2)',  // Ataque
                    'rgba(255, 206, 86, 0.2)',  // Defensa
                    'rgba(75, 192, 192, 0.2)',  // Ataque especial
                    'rgba(153, 102, 255, 0.2)', // Defensa especial
                    'rgba(255, 159, 64, 0.2)'   // Velocidad
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',    // Borde PS
                    'rgba(54, 162, 235, 1)',    // Borde Ataque
                    'rgba(255, 206, 86, 1)',    // Borde Defensa
                    'rgba(75, 192, 192, 1)',    // Borde Ataque especial
                    'rgba(153, 102, 255, 1)',   // Borde Defensa especial
                    'rgba(255, 159, 64, 1)'     // Borde Velocidad
                ],
                borderWidth: 1
            }]
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            x: {
                ticks: {
                    color: 'green',
                },
            },
        };

        const myChart = new Chart(chartRef, {
            type: 'bar',
            data: data,
            options: options
        });

        return () => {
            myChart.destroy();
        };
    }, [pokemon, chartRef]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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
    window.addEventListener('scroll', () => {
        const scrollToTopBtn = document.getElementById('scrollToTopBtn');
        if (window.scrollY > 520) {
            scrollToTopBtn.classList.add('show');
            scrollToTopBtn.classList.remove('hide');
        } else {
            scrollToTopBtn.classList.remove('show');
            scrollToTopBtn.classList.add('hide');
        }
    });

    return (
        <div className='card-jsx'>
            <div id="top"></div>
            <div className="back">
                <a href="/">
                    <span class="material-symbols-outlined">
                        arrow_back_ios_new
                    </span>
                </a>
            </div>
            <div className="cont-card-gen">
                <div className="tittle-cont">
                    <h3>{pokemon.name}</h3>
                    <p>N.° {pokemon.id.toString().padStart(4, '0')}</p>
                </div>
                <div className="details-cont">
                    <div className="img-peso-cont">
                        <div className="img-cont">
                            <img src={sprites.other['official-artwork'].front_default} alt={pokemon.name} />
                        </div>
                        <div className="peso-cont">
                            <div className="description-cont">
                                <p>{description}</p>
                            </div>

                            <div className="peso">
                                <div className="column1">
                                    <div className='bot-flex'><p>Peso:</p> <span>{(weight / 10).toFixed(1)} kg</span></div>
                                    <div className='bot-flex'><p>Altura:</p> <span>{(height / 10).toFixed(1)} m</span></div>
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
                            <div className="types-cont">
                                <p>Tipos:</p>
                                <p className="pokecard-type">
                                        {pokemon.types.map((typeInfo, idx) => (
                                        <span key={idx} className={`type-${typeInfo.type.name}`}>
                                            {typeInfo.type.name}{idx < pokemon.types.length - 1 ? ' ' : ''}
                                        </span>
                                    ))}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="cont-dot-graphs">
                            <canvas ref={setChartRef}></canvas>
                    </div>
                    <div className="weaknesses">
                        <p>Debilidades:</p>
                        <div className='pokecard-type'>
                            {weaknesses?.map((weakness, idx) => (
                                <span key={idx} className={`type-${weakness}`}>
                                    {weakness}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className='chain-evolution'>
                        <p>Cadena de evolución:</p>
                        <div className="back-evo">
                            {evolutionChain && (
                                <ul>
                                    {renderEvolutionChain(evolutionChain)}
                                </ul>
                            )}
                        </div>
                        
                    </div>
                    <a href="#top" id="scrollToTopBtn">
                        <span className="material-symbols-outlined">
                            expand_less
                        </span>
                    </a>
                </div>              
            </div>           
        </div>
    );

    function renderEvolutionChain(chain) {
        const renderChain = (node) => {
            return (
                <div className="evolution-chain" key={node.species.name}>
                    <div className='mid-evo'>
                        <div className="img-evolution">
                            <img src={evolutionImages[node.species.name]} alt={node.species.name} />
                        </div>
                        <div className="evolution-info">
                            <h4>{node.species.name} </h4>
                            {evolutionIds[node.species.name] ? (
                                <p className='evo-id'>N.°{evolutionIds[node.species.name].toString().padStart(4, '0')}</p>
                            ) : (
                                <p>No hay ID de evolución disponible para este Pokémon</p>
                            )}                      
                        </div>
                    </div>
                    {node.evolves_to.length > 0 && (
                            <ul className='evo-ul'>
                                {node.evolves_to.map(childNode => renderChain(childNode))}
                            </ul>
                        )}
                </div>
            );
        };
        return renderChain(chain);
    }
};    
export default Card;
