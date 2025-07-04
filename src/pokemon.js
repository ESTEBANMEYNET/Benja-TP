const container = document.getElementById('pokemon-detail-container');
const backBtn = document.getElementById('back-btn');
import './style.css';
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (!id) {
  container.innerHTML = '<p>ID de Pokémon no especificado.</p>';
} else {
  fetchPokemonDetail(id);
}

backBtn.addEventListener('click', () => {
  window.location.href = 'index.html';
});

async function fetchPokemonDetail(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    const data = await res.json();

    displayPokemonDetail(data);
  } catch (error) {
    container.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

function displayPokemonDetail(pokemon) {
  container.innerHTML = `
    <h2>${pokemon.name.toUpperCase()} (#${pokemon.id})</h2>
    <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}" /><br><br>
    <br>
    <p><strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(', ')}</p>
    <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
    <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
    <p><strong>Habilidades:</strong> ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p>
    <h3>Estadísticas</h3>
    <ul>
      ${pokemon.stats.map(s => `<li>${s.stat.name}: ${s.base_stat}</li>`).join('')}
    </ul>
  `;
}