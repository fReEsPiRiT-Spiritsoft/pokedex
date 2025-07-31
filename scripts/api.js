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
     * Loads detailed information for a single Pokémon from the API.
     * @param {string} url - API URL of the Pokémon.
     * @param {number} id - Pokémon ID.
     * @returns {Promise<Object|null>} Pokémon object or null if failed.
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
            pokemon.name.toLowerCase().includes(searchTerm) ||
            pokemon.germanName.toLowerCase().includes(searchTerm) ||
            pokemon.id.toString() === searchTerm
        );
    }
}