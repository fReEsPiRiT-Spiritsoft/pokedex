/**
 * Enables background music playback after the first user interaction (click or touch).
 * This is required by most browsers to allow autoplay of audio.
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


/**
 * Plays the Pokéball throw sound effect.
 * Used when a Pokéball is thrown in the arena animation.
 */
function playPokeballSound() {
    const audio = new Audio('./sounds/pokeball.mp3');
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    audio.volume = volume;
    audio.play();
}

/**
 * Plays the card switch sound effect.
 * Used when switching between Pokémon cards in the UI.
 */
function playCardSwitchSound() {
    const audio = new Audio('./sounds/switchcard.mp3');
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    audio.volume = volume;
    audio.play();
}

/**
 * Initializes the background audio object if not already created and sets the volume.
 */
function initBackgroundAudio() {
    if (!backgroundAudio) {
        backgroundAudio = new Audio('./sounds/backgroundmusik.mp3');
        backgroundAudio.loop = true;
    }
    const volumeSlider = document.getElementById('volumeMusik');
    let volume = 0.4;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    backgroundAudio.volume = volume;
}

/**
 * Plays the background music only when it is ready.
 * Calls initBackgroundAudio() before attempting to play.
 */
function playBackgroundSound() {
    initBackgroundAudio();
    if (backgroundAudio.readyState >= 4) {
        backgroundAudio.play();
    } else {
        backgroundAudio.addEventListener('canplaythrough', function handler() {
            backgroundAudio.removeEventListener('canplaythrough', handler);
            backgroundAudio.play();
        });
    }
}

/**
 * Updates the sound effects volume when the effects volume slider changes.
 * Applies to all sound effects.
 */
document.getElementById('volume').addEventListener('input', function () {
});

/**
 * Updates the background music volume when the music volume slider changes.
 * Applies only to the background music audio object.
 */
document.getElementById('volumeMusik').addEventListener('input', function () {
    if (backgroundAudio) {
        let volume = Math.max(0, Math.min(1, this.value / 11));
        backgroundAudio.volume = volume;
    }
});

/**
 * Plays a random local voice sound for the given Pokémon ID.
 * @param {string} pokemonId - The three-digit Pokémon ID.
 * @returns {boolean} True if a local sound was played, otherwise false.
 */
function playLocalPokemonVoice(pokemonId) {
    const voices = window.pokemonVoices;
    if (voices && voices[pokemonId] && voices[pokemonId].length > 0) {
        const chosenVoice = voices[pokemonId][Math.floor(Math.random() * voices[pokemonId].length)];
        const audio = new Audio(`./sounds/pokemonVoices/${chosenVoice}`);
        const volumeSlider = document.getElementById('volume');
        let volume = 0.7;
        if (volumeSlider) volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
        audio.volume = volume * 0.4;
        audio.play().catch(() => {});
        return true;
    }
    return false;
}

/**
 * Plays the fallback Pokémon cry from PokemonShowdown.
 * @param {string} pokemonName - The English Pokémon name.
 */
function playShowdownCry(pokemonName) {
    const audioUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.ogg`;
    const cryAudio = new Audio(audioUrl);
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    cryAudio.volume = volume * 0.4;
    cryAudio.play().catch(() => {});
}

/**
 * Handles playing the Pokémon cry, preferring local sounds and falling back to PokemonShowdown.
 * @param {string} pokemonId - The three-digit Pokémon ID.
 * @param {string} pokemonName - The English Pokémon name.
 */
async function playPokemonCry(pokemonId, pokemonName) {
    if (!window.pokemonVoices) {
        window.pokemonVoices = await fetch('./sounds/pokemonVoices/voices.json').then(r => r.json());
    }
    if (playLocalPokemonVoice(pokemonId)) return;
    playShowdownCry(pokemonName);
}