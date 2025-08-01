/**
 * Sets up event listener for opening the Pokémon selection view when the Pokéball button is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-selection-btn');
    const selection = document.querySelector('.pokemon-selection');
    if (openBtn && selection) {
        openBtn.addEventListener('click', () => {
            selection.classList.add('active');
            selection.style.display = 'block';
            // openBtn.style.display = 'none';
        });
    }
});

/**
 * Opens the settings/info modal when the settings button is clicked.
 */
document.getElementById('settings-btn').onclick = function() {
    document.getElementById('settings-modal').classList.remove('hidden');
};

/**
 * Closes the settings/info modal when the close button is clicked.
 */
document.getElementById('close-settings-modal').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};

/**
 * Closes the settings/info modal when the overlay is clicked.
 */
document.querySelector('.modal-overlay').onclick = function() {
    document.getElementById('settings-modal').classList.add('hidden');
};

/**
 * Shows the selected modal section (Impressum, Copyright, Portfolio, etc.) in the settings modal.
 * @param {string} section - Section name to show (e.g. 'impressum').
 */
function showModalSection(section) {
    document.querySelectorAll('.modal-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('modal-' + section).classList.remove('hidden');
}

/**
 * Initializes the Pokédex app when the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', initializePokedex);