let allPokemon = [];
let currentPokemon = null;
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
            
            // Detaillierte Daten für jedes Pokemon laden
            const pokemonPromises = data.results.map(async (pokemon, index) => {
                return await this.loadPokemonDetails(pokemon.url, index + offset + 1);
            });
            
            allPokemon = await Promise.all(pokemonPromises);
            console.log('Pokemon erfolgreich geladen:', allPokemon);
            return allPokemon;
            
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

// Ladeanimation mit Pokeball
function showLoadingAnimation() {
    console.log('🔴 Pokeball rollt... Lade Pokemon Daten...');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
    }
}

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

// Arena Video Management
function initializeArena() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');
    
    if (arenaVideo) {
        // Video sofort starten
        arenaVideo.play().catch(error => {
            console.log('Autoplay nicht möglich, zeige PNG direkt:', error);
            handleArenaVideoEnd();
        });
        
        // Event Listener für Video-Ende
        arenaVideo.addEventListener('ended', handleArenaVideoEnd);
        
        // Fallback: Wenn Video nicht lädt, nach 3 Sekunden PNG zeigen
        setTimeout(() => {
            if (arenaVideo.currentTime === 0) {
                console.log('Video lädt nicht, zeige PNG');
                handleArenaVideoEnd();
            }
        }, 3000);
    }
}

// Video → PNG Übergang
function handleArenaVideoEnd() {
    const arenaVideo = document.getElementById('arena-video');
    const arenaBackground = document.getElementById('arena-background');
    
    console.log('🎬 Arena Video beendet - Wechsel zu PNG');
    
    if (arenaVideo && arenaBackground) {
        // weciher Übergang von Video zu PNG
        arenaVideo.style.opacity = '0';
        arenaVideo.style.transition = 'opacity 0.5s ease-in-out';
        
        // PNG nach kurzer Verzögerung einblenden
        setTimeout(() => {
            arenaVideo.style.display = 'none';
            arenaBackground.classList.remove('hidden');
            arenaBackground.style.opacity = '0';
            arenaBackground.style.transition = 'opacity 1.5s ease-out';
            
            // PNG einblenden
            requestAnimationFrame(() => {
                arenaBackground.style.opacity = '1';
            });
            
            console.log('✅ Arena bereit für Pokemon Auswahl!');
        }, 100);
    }
}

// Pokemon Auswahl und Arena-Interaktion
function selectPokemon(pokemonData) {
    currentPokemon = pokemonData;
    console.log(`🎯 Pokemon ausgewählt: ${pokemonData.germanName}`);
     // Modal ausblenden
    const selection = document.querySelector('.pokemon-selection');
    if (selection) {
        selection.classList.remove('active');
    }
    // Pokeball Animation zur Arena
    animatePokeballToArena(() => {
        // Pokemon in Arena anzeigen
        displayPokemonInArena(pokemonData);
    });
}

function animatePokeballToArena(callback) {
    const pokeballAnimation = document.getElementById('pokeball-animation');
    
    if (pokeballAnimation) {
        pokeballAnimation.classList.remove('hidden');
        pokeballAnimation.style.animation = 'flyToArena 2s ease-in-out forwards';
        
        // Nach Animation: Pokemon anzeigen
        setTimeout(() => {
            pokeballAnimation.classList.add('hidden');
            if (callback) callback();
        }, 2000);
    } else if (callback) {
        callback();
    }
}

function displayPokemonInArena(pokemonData) {
    const selectedPokemon = document.getElementById('selected-pokemon');
    const pokemonSprite = document.getElementById('pokemon-sprite');
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonTypes = document.getElementById('pokemon-types');
    const pokemonStats = document.getElementById('pokemon-stats');
    
    if (selectedPokemon && pokemonSprite && pokemonName) {
        // Pokemon Bild setzen
        pokemonSprite.src = pokemonData.sprites.official || pokemonData.sprites.front;
        pokemonSprite.alt = pokemonData.germanName;
        
        // Pokemon Name
        pokemonName.textContent = pokemonData.germanName;
        
        // Pokemon Typen
        if (pokemonTypes) {
            pokemonTypes.innerHTML = pokemonData.types
                .map(type => `<span class="type type-${type}">${getGermanTypeName(type)}</span>`)
                .join('');
        }
        
        // Pokemon Stats
        if (pokemonStats) {
            pokemonStats.innerHTML = `
                <div class="stat">
                    <span>KP:</span>
                    <span>${pokemonData.stats.hp}</span>
                </div>
                <div class="stat">
                    <span>Angriff:</span>
                    <span>${pokemonData.stats.attack}</span>
                </div>
                <div class="stat">
                    <span>Verteidigung:</span>
                    <span>${pokemonData.stats.defense}</span>
                </div>
                <div class="stat">
                    <span>Initiative:</span>
                    <span>${pokemonData.stats.speed}</span>
                </div>
            `;
        }
        
        // Pokemon in Arena einblenden
        selectedPokemon.classList.remove('hidden');
        selectedPokemon.style.animation = 'pokemonAppear 1s ease-in-out forwards';
        
        console.log(`✨ ${pokemonData.germanName} erscheint in der Arena!`);
    }
}

// Hilfsfunktion für deutsche Typ-Namen
function getGermanTypeName(englishType) {
    const typeTranslations = {
        'fire': 'Feuer',
        'water': 'Wasser',
        'grass': 'Pflanze',
        'electric': 'Elektro',
        'psychic': 'Psycho',
        'ice': 'Eis',
        'dragon': 'Drache',
        'dark': 'Unlicht',
        'fairy': 'Fee',
        'fighting': 'Kampf',
        'poison': 'Gift',
        'ground': 'Boden',
        'flying': 'Flug',
        'bug': 'Käfer',
        'rock': 'Gestein',
        'ghost': 'Geist',
        'steel': 'Stahl',
        'normal': 'Normal'
    };
    
    return typeTranslations[englishType] || englishType;
}

// App Initialisierung
async function initializePokedex() {
    showLoadingAnimation();
    
    try {
        await PokemonAPI.loadPokemonList(150); // Erste Generation
        hideLoadingAnimation();
        console.log('Pokedex erfolgreich initialisiert!');
        
        // Pokemon Karten anzeigen
        displayPokemonCards();
        
        // Event Listeners für Interaktionen
        setupEventListeners();
        
    } catch (error) {
        console.error('Fehler bei der Initialisierung:', error);
        hideLoadingAnimation();
    }
}

// Event Listeners für UI-Interaktionen
function setupEventListeners() {
    // Suchfunktion
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
    
    // Type Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Aktiven Button ändern
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter anwenden
            const filterType = btn.dataset.type;
            filterPokemonByType(filterType);
        });
    });
}

// Suchfunktion
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

// Filter Pokemon nach Typ
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

// Pokemon Karten anzeigen (wird in template.js implementiert)
function displayPokemonCards(pokemonList = allPokemon) {
    const selectionSection = document.querySelector('.pokemon-selection');
    if (!selectionSection) return;

    // Vorherige Karten entfernen
    let grid = document.getElementById('pokemon-cards-grid');
    if (!grid) {
        grid = document.createElement('div');
        grid.id = 'pokemon-cards-grid';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
        grid.style.gap = '20px';
        selectionSection.appendChild(grid);
    }
    grid.innerHTML = '';

    // Karten hinzufügen
    pokemonList.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        card.innerHTML = `
            <img src="${pokemon.sprites.official || pokemon.sprites.front}" alt="${pokemon.germanName}" style="width:100px;height:100px;">
            <h3>${pokemon.germanName}</h3>
            <div>${pokemon.types.map(t => `<span>${getGermanTypeName(t)}</span>`).join(' ')}</div>
        `;
        card.onclick = () => selectPokemon(pokemon);
        grid.appendChild(card);
    });
}

function backToBall() {
    const selectedPokemon = document.getElementById('selected-pokemon');
    if (selectedPokemon) {
        selectedPokemon.classList.add('hidden');
    }
    
    // Pokeball Animation zurück zur Auswahl
    const pokeballAnimation = document.getElementById('pokeball-animation');
    if (pokeballAnimation) {
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