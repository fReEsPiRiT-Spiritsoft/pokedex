/**
 *  Spielt den Pokeball-Wurf-Sound ab
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
 *  Spielt den Soundeffekt für den Kartenwechsel ab
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
 *  Spielt die Hintergrundmusik ab
 */
function playBackgroundSound() {
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
    backgroundAudio.play();
}

/**
 *  Lautstärke bei Änderung des Sliders anpassen
 */
document.getElementById('volume').addEventListener('input', function () {
});

document.getElementById('volumeMusik').addEventListener('input', function () {
    if (backgroundAudio) {
        let volume = Math.max(0, Math.min(1, this.value / 11));
        backgroundAudio.volume = volume;
    }
});

async function playPokemonCry(pokemonId, pokemonName) {
    // voices.json laden (nur einmal pro Session cachen)
    if (!window.pokemonVoices) {
        window.pokemonVoices = await fetch('./sounds/pokemonVoices/voices.json').then(r => r.json());
    }
    const voices = window.pokemonVoices;

    // Prüfe, ob für die ID lokale Voice-Dateien existieren
    if (voices[pokemonId] && voices[pokemonId].length > 0) {
        // Zufällig eine Datei auswählen
        const chosenVoice = voices[pokemonId][Math.floor(Math.random() * voices[pokemonId].length)];
        const audio = new Audio(`./sounds/pokemonVoices/${chosenVoice}`);
        const volumeSlider = document.getElementById('volume');
        let volume = 0.7;
        if (volumeSlider) {
            volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
        }
        audio.volume = volume * 0.4;
        audio.play().catch(() => {});
        return;
    }

    // Fallback: Showdown-Cry
    const audioUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemonName.toLowerCase()}.ogg`;
    const cryAudio = new Audio(audioUrl);
    const volumeSlider = document.getElementById('volume');
    let volume = 0.7;
    if (volumeSlider) {
        volume = Math.max(0, Math.min(1, volumeSlider.value / 11));
    }
    cryAudio.volume = volume * 0.4;
    cryAudio.play().catch(() => {});
}