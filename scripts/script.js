let allPokemon = [];
let currentPokemon = null;
let currentOffset = 150;
let backgroundAudio = null;
const API_BASE_URL = 'https://pokeapi.co/api/v2';

class PokemonAPI {
    
    /**
     * Lädt eine bestimmte Anzahl von Pokemon aus der API
     * @param {number} limit - Anzahl der Pokemon (Standard: 150 für Gen 1)
     * @param {number} offset - Startpunkt (Standard: 0)
     */
    static async loadPokemonList(limit = 150, offset = 0) {
        try {
            console.log('Lade Pokemon Liste...');
            const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            const pokemonPromises = data.results.map(async (pokemon, index) => {
                return await this.loadPokemonDetails(pokemon.url, index + offset + 1);
            });
            return await Promise.all(pokemonPromises);
        } catch (error) {
            console.error('Fehler beim Laden der Pokemon:', error);
            return [];
        }
    }
    
    /**
     * Lädt detaillierte informationen für ein einzelnes pokemon
     * @param {string} url - API URL des Pokemon
     * @param {number} id - Pokemon ID
     */
    static async loadPokemonDetails(url, id) {
        try {
            const response = await fetch(url);
            const pokemon = await response.json();
            return {
                id: pokemon.id,
                name: pokemon.name,
                germanName: await this.getGermanName(pokemon.species.url),
                types: pokemon.types.map(type => type.type.name),
                stats: {
                    hp: pokemon.stats[0].base_stat,
                    attack: pokemon.stats[1].base_stat,
                    defense: pokemon.stats[2].base_stat,
                    speed: pokemon.stats[5].base_stat
                },
                sprites: {
                    front: pokemon.sprites.front_default,
                    frontShiny: pokemon.sprites.front_shiny,
                    official: pokemon.sprites.other['official-artwork'].front_default
                },
                height: pokemon.height,
                weight: pokemon.weight,
                abilities: pokemon.abilities.map(ability => ability.ability.name)
            };
            
        } catch (error) {
            console.error(`Fehler beim Laden von Pokemon ${id}:`, error);
            return null;
        }
    }
    
    /**
     * Holt den deutschen Namen des Pokemon
     * @param {string} speciesUrl - URL der Pokemon Species
     */
    static async getGermanName(speciesUrl) {
        try {
            const response = await fetch(speciesUrl);
            const species = await response.json();
            
            const germanName = species.names.find(name => name.language.name === 'de');
            return germanName ? germanName.name : species.name;
            
        } catch (error) {
            console.error('Fehler beim Laden des deutschen Namens:', error);
            return 'Unbekannt';
        }
    }
    
    /**
     * Sucht Pokemon nach Namen oder ID
     * @param {string|number} query - Suchbegriff
     */
    static searchPokemon(query) {
        const searchTerm = query.toString().toLowerCase();
        return allPokemon.filter(pokemon => 
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.germanName.toLowerCase().includes(searchTerm) ||
            pokemon.id.toString() === searchTerm
        );
    }
}

/**
 * Zeigt das ausgewählte Pokemon in der Arena an
 */
function showLoadingAnimation() {
    console.log('🔴 Pokeball rollt... Lade Pokemon Daten...');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 *  * Versteckt die Ladeanimation und zeigt die Haupt-App an
 */
function hideLoadingAnimation() {
    console.log('✅ Pokemon Daten geladen!');
    const loadingScreen = document.getElementById('loading-screen');
    const mainApp = document.getElementById('main-app');   
    if (loadingScreen && mainApp) {
        loadingScreen.style.display = 'none';
        mainApp.classList.remove('hidden');    
        // Arena Video starten
        initializeArena();
    }
}

/**
 *  Spielt das Arena video ab und zeigt das PNG bei Ende an
 */
function initializeArena() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');    
    if (arenaVideo) {
        arenaVideo.play().catch(error => {
            console.log('Autoplay nicht möglich, zeige PNG direkt:', error);
            handleArenaVideoEnd();
        });
        arenaVideo.addEventListener('ended', handleArenaVideoEnd); 
        setTimeout(() => {
            if (arenaVideo.currentTime === 0) {
                console.log('Video lädt nicht, zeige PNG');
                handleArenaVideoEnd();
            }
        }, 3000);
    }
}

/**
 *  * Video → PNG Übergang
 */
function handleArenaVideoEnd() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');
    console.log('🎬 Arena Video beendet - Wechsel zu PNG');
    if (arenaVideo && arenaBackground) {
        arenaVideo.style.opacity = '0';
        arenaVideo.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
            arenaVideo.style.display = 'none';
            arenaBackground.classList.remove('hidden');
            arenaBackground.style.opacity = '0';
            arenaBackground.style.transition = 'opacity 1.5s ease-out';
            requestAnimationFrame(() => {
                arenaBackground.style.opacity = '1';
            });
            console.log('✅ Arena bereit für Pokemon Auswahl!');
        }, 100);
    }
}

/**
 *   Zeigt das ausgewählte Pokemon in der Arena an
 */
function selectPokemon(pokemonData) {
    currentPokemon = pokemonData;
    console.log(`🎯 Pokemon ausgewählt: ${pokemonData.germanName}`);
    const selection = document.querySelector('.pokemon-selection');
    if (selection) {
        selection.classList.remove('active');
    }
    animatePokeballToArena(() => {
        displayPokemonInArena(pokemonData);
    });
}

/**
 *  * Animiert den Pokeball zur Arena und zeigt das Pokemon an
 */
function animatePokeballToArena(callback) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
        playPokeballSound()
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToArena 2s ease-in-out forwards';
        setTimeout(() => {
            pokeballAnimation.classList.add('hidden');
            if (callback) callback();
        }, 2000);
    } else if (callback) {
        callback();
    }
}

/**
 *   Startet die große Animation und zeigt das Pokemon in der Arena an
 */
async function initializePokedex() {
    showLoadingAnimation();
    try {
        // Beim ersten Laden: allPokemon setzen!
        allPokemon = await PokemonAPI.loadPokemonList(150);
        hideLoadingAnimation();
        console.log('Pokedex erfolgreich initialisiert!');
        displayPokemonCards();
        setupEventListeners();
    } catch (error) {
        console.error('Fehler bei der Initialisierung:', error);
        hideLoadingAnimation();
    }
}

/**
 *  Initialisiert alle Event Listener
 */
function setupEventListeners() {
    setupSearchListeners();
    setupFilterListeners();
}

/**
 *  Initialisiert die Event Listener für die Suchfunktion
 */
function setupSearchListeners() {
    const searchInput = document.getElementById('pokemon-search');
    const searchBtn = document.getElementById('search-btn');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
}

/**
 *  Initialisiert die Event Listener für die Filter-Buttons
 */
function setupFilterListeners() {
    const filterButtons = document.querySelectorAll('.filter-btn'); 
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filterType = btn.dataset.type;
            filterPokemonByType(filterType);
        });
    });
}

/**
 *  Handhabt die Suchanfragen für Pokemon
 */
function handleSearch() {
    const searchInput = document.getElementById('pokemon-search');
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
        const searchResults = PokemonAPI.searchPokemon(query);
        displayPokemonCards(searchResults);
    } else {
        displayPokemonCards();
    }
}

/**
 *  Filtert die Pokemon nach Typ
 */
function filterPokemonByType(type) {
    if (type === 'all') {
        displayPokemonCards();
    } else {
        const filteredPokemon = allPokemon.filter(pokemon => 
            pokemon.types.includes(type)
        );
        displayPokemonCards(filteredPokemon);
    }
}

/**
 *  Zeigt die Pokemon Karten an
 */
function displayPokemonCards(pokemonList = allPokemon) {
    const selectionSection = document.querySelector('.pokemon-selection');
    if (!selectionSection) return;
    let grid = document.getElementById('pokemon-cards-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.id = 'pokemon-cards-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
        grid.style.gap = '20px';
        selectionSection.appendChild(grid);
    }
    addPokeCard(pokemonList = allPokemon)
}

/**
 * Blendet das ausgewählte Pokemon aus
 */
function hidePokemon() {
    const selectedPokemon = document.getElementById('selected-pokemon');
    if (selectedPokemon) {
        selectedPokemon.classList.add('hidden');
    }
}

/**
 * Animiert den Pokeball zurück zur Auswahl
 */
function animatePokeballBack() {
    // Pokeball Animation zurück zur Auswahl
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
        playPokeballSound();
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToSelection 2s ease-in-out forwards';       
        // Nach Animation: Pokeball zurück zur Auswahl
        setTimeout(() => {
            pokeballAnimation.classList.add('hidden');
            const openBtn = document.getElementById('open-selection-btn');
            if (openBtn) {
                openBtn.style.display = 'block'; // Pokeball-Button wieder anzeigen
            }
        }, 1000);
    }
}

/**
 * Blendet das ausgewählte Pokemon wieder aus und zeigt die Auswahl an
 */
function backToBall() {
    hidePokemon();
    animatePokeballBack();
}

function showFilterBTN() {
    const filterBtn = document.getElementById('show-filter-btn');
    const filterContainer = document.querySelector('div.filter-btn-group'); // Der Container!
    filterContainer.classList.toggle('hidden');
}

async function loadMorePokemonFromAPI() {
    showLoadingAnimation();
    try {
        const newPokemon = await PokemonAPI.loadPokemonList(50, currentOffset);
        allPokemon = [...allPokemon, ...newPokemon.filter(p => p)];
        currentOffset += 50;
        displayPokemonCards(allPokemon);
    } catch (error) {
        console.error('Fehler beim Nachladen weiterer Pokémon:', error);
    } finally {
        hideLoadingAnimation();
    }
}

/**
 *  Aktiviert den Hintergrundsound bei Benutzerinteraktionen
 */
function enableBackgroundSoundOnUserAction() {
    function startSound() {
        playBackgroundSound();
        document.removeEventListener('touchstart', startSound);
        document.removeEventListener('click', startSound);
    }
    document.addEventListener('touchstart', startSound, { once: true });
    document.addEventListener('click', startSound, { once: true });
}

document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-selection-btn');
    const selection = document.querySelector('.pokemon-selection');
    if (openBtn && selection) {
        openBtn.addEventListener('click', () => {
            selection.classList.add('active');
            openBtn.style.display = 'none'; // Pokeball-Button ausblenden
        });
    }
});
// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', initializePokedex);