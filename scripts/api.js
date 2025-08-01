/**
 * Array containing all loaded Pokémon objects.
 * @type {Array}
 */
let allPokemon = [];

/**
 * The currently selected Pokémon object.
 * @type {Object|null}
 */
let currentPokemon = null;

/**
 * Current offset for loading more Pokémon from the API.
 * @type {number}
 */
let currentOffset = 150;

/**
 * Global background audio object for music playback.
 * @type {Audio|null}
 */
let backgroundAudio = null;

/**
 * Base URL for the PokeAPI.
 * @type {string}
 */
const API_BASE_URL = 'https://pokeapi.co/api/v2';


/**
 * Utility class for interacting with the PokeAPI.
 */
class PokemonAPI {
    /**
     * Loads a specific number of Pokémon from the API.
     * @param {number} [limit=150] - Number of Pokémon to load (default: 150 for Gen 1).
     * @param {number} [offset=0] - Offset for pagination (default: 0).
     * @returns {Promise<Array>} Array of Pokémon objects.
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
 * Loads detailed information for a single Pokémon from the API and returns a structured Pokémon object.
 * @param {string} url - API URL of the Pokémon.
 * @param {number} id - Pokémon ID.
 * @returns {Promise<Object|null>} Pokémon object with all relevant fields, or null if loading fails.
 */
static async loadPokemonDetails(url, id) {
    try {
        const pokemon = await this.fetchPokemonData(url);
        const germanName = await this.getGermanName(pokemon.species.url);
        return this.buildPokemonObject(pokemon, germanName);
    } catch (error) {
        return null;
    }
}

/**
 * Fetches the raw Pokémon data from the API.
 * @param {string} url - API URL of the Pokémon.
 * @returns {Promise<Object>} Raw Pokémon data object from the API.
 */
static async fetchPokemonData(url) {
    const response = await fetch(url);
    return await response.json();
}

/**
 * Parses the base stats from the Pokémon data object.
 * @param {Object} pokemon - Raw Pokémon data object.
 * @returns {Object} Object containing hp, attack, defense, and speed stats.
 */
static parsePokemonStats(pokemon) {
    return {
        hp: pokemon.stats[0].base_stat,
        attack: pokemon.stats[1].base_stat,
        defense: pokemon.stats[2].base_stat,
        speed: pokemon.stats[5].base_stat
    };
}

/**
 * Parses the sprite URLs from the Pokémon data object.
 * @param {Object} pokemon - Raw Pokémon data object.
 * @returns {Object} Object containing URLs for front, frontShiny, and official artwork sprites.
 */
static parsePokemonSprites(pokemon) {
    return {
        front: pokemon.sprites.front_default,
        frontShiny: pokemon.sprites.front_shiny,
        official: pokemon.sprites.other['official-artwork'].front_default
    };
}

/**
 * Parses the abilities from the Pokémon data object.
 * @param {Object} pokemon - Raw Pokémon data object.
 * @returns {Array<string>} Array of ability names.
 */
static parsePokemonAbilities(pokemon) {
    return pokemon.abilities.map(ability => ability.ability.name);
}

/**
 * Builds a structured Pokémon object from raw data and the German name.
 * @param {Object} pokemon - Raw Pokémon data object.
 * @param {string} germanName - German name of the Pokémon.
 * @returns {Object} Structured Pokémon object with all relevant fields.
 */
static buildPokemonObject(pokemon, germanName) {
    return {
        id: pokemon.id,
        name: pokemon.name,
        germanName,
        types: pokemon.types.map(type => type.type.name),
        stats: this.parsePokemonStats(pokemon),
        sprites: this.parsePokemonSprites(pokemon),
        height: pokemon.height,
        weight: pokemon.weight,
        abilities: this.parsePokemonAbilities(pokemon)
    };
}

    /**
     * Retrieves the German name of a Pokémon species from the API.
     * @param {string} speciesUrl - URL of the Pokémon species.
     * @returns {Promise<string>} German name or fallback name.
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
     * Searches Pokémon by name or ID in the loaded Pokémon array.
     * @param {string|number} query - Search term (name or ID).
     * @returns {Array} Array of matching Pokémon objects.
     */
    static searchPokemon(query) {
        const searchTerm = query.toString().toLowerCase();
        return allPokemon.filter(pokemon =>
            pokemon.germanName.toLowerCase().includes(searchTerm) ||
            pokemon.id.toString() === searchTerm
        );
    }
}