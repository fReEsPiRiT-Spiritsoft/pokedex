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
            const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
            const data = await response.json();
            const pokemonPromises = data.results.map(async (pokemon, index) => {
                return await this.loadPokemonDetails(pokemon.url, index + offset + 1);
            });
            return await Promise.all(pokemonPromises);
        } catch (error) {
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
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

/**
 *  * Versteckt  ladeanimation und zeigt die Haupt-App an
 */
function hideLoadingAnimation() {
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
            handleArenaVideoEnd();
        });
        arenaVideo.addEventListener('ended', handleArenaVideoEnd);
        setTimeout(() => {
            if (arenaVideo.currentTime === 0) {
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
        }, 100);
    }
}

/**
 *   Zeigt das ausgewählte Pokemon in der Arena an
 */
function selectPokemon(pokemonData) {
    currentPokemon = pokemonData;
    const selection = document.querySelector('.pokemon-selection');
    if (selection) {
        selection.classList.remove('active');
        selection.style.display = 'none';
    }
        document.getElementById('open-selection-btn').style.display = 'none';
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
        allPokemon = await PokemonAPI.loadPokemonList(150);
        hideLoadingAnimation();
        displayPokemonCards();
        setupEventListeners();
    } catch (error) {
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
function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-card');
    if (loadMoreBtn) loadMoreBtn.style.display = 'none';
}

function showLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.load-more-card');
    if (loadMoreBtn) loadMoreBtn.style.display = 'flex';
}



function handleSearch() {
    const searchInput = document.getElementById('pokemon-search');
    if (!searchInput) return;
    const query = searchInput.value.trim();
    if (query) {
        const searchResults = PokemonAPI.searchPokemon(query);
        displayPokemonCards(searchResults);
        hideLoadMoreButton();
    } else {
        displayPokemonCards();
        showLoadMoreButton();
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

function closeCardOverlay() {
    document.getElementById('card-overlay').classList.add('hidden');
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
function showPokemonSelection() {
    document.querySelector('.pokemon-selection').style.display = 'block';
}

function animatePokeballBack(showSelection = true) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
        playPokeballSound();
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToSelection 2s ease-in-out forwards';
        setTimeout(() => {
            pokeballAnimation.classList.add('hidden');
            const openBtn = document.getElementById('open-selection-btn');
            if (openBtn) {
                openBtn.style.display = 'block';
            }
            if (showSelection) {
                showPokemonSelection();
            }
        }, 2000);
    }
}

/**
 * Blendet das ausgewählte Pokemon wieder aus und zeigt die Auswahl an
 */
function backToBall() {
    hidePokemon();
    animatePokeballBack(true);
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
    } finally {
        hideLoadingAnimation();
    }
}

function showCloseInformation() {
    const infoBox = document.getElementById('pokemon-info');
    const closeHint = document.getElementById('close-hint');
    if (infoBox && closeHint) {
        infoBox.addEventListener('mouseenter', () => {
            closeHint.style.display = 'block';
        });
        infoBox.addEventListener('mouseleave', () => {
            closeHint.style.display = 'none';
        });
    }
}

function displayPokemonInArena(pokemonData) {
    const selectedPokemon = document.getElementById('selected-pokemon');
    const pokemonSprite = document.getElementById('pokemon-sprite');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');
    if (selectedPokemon && pokemonSprite && pokemonName) {
        const arenaHTML = getPokemonArenaHTML(pokemonData);
        pokemonSprite.src = arenaHTML.spriteSrc;
        pokemonSprite.alt = arenaHTML.spriteAlt;
        pokemonName.textContent = arenaHTML.name;
        if (pokemonTypes) {
            pokemonTypes.innerHTML = arenaHTML.typesHTML;
        }
        if (pokemonStats) {
            pokemonStats.innerHTML = arenaHTML.statsHTML;
        }
        selectedPokemon.classList.remove('hidden');
        selectedPokemon.style.animation = 'pokemonAppear 1s ease-in-out forwards';
        showCloseInformation()
        playPokemonCry(pokemonData.id.toString().padStart(3, '0'), pokemonData.name);
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

// Öffnen des Modals
document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').classList.remove('hidden');
};
// Schließen des Modals
document.getElementById('close-settings-modal').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};
// Schließen beim Klick auf Overlay
document.querySelector('.modal-overlay').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};
// Navbar-Wechsel
function showModalSection(section) {
    document.querySelectorAll('.modal-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('modal-' + section).classList.remove('hidden');
}
// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', initializePokedex);



