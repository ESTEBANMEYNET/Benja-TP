const container = document.getElementById('pokemon-container');
const searchInput = document.getElementById('search-input');
const typeFilter = document.getElementById('type-filter');
const sortOrder = document.getElementById('sort-order');
import './style.css';
let allPokemons = [];

function createPokemonCard(pokemon) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');

  card.innerHTML = `
    <h3>${pokemon.name.toUpperCase()}</h3>
    <img src="${pokemon.image}" alt="${pokemon.name}">
  `;

  card.addEventListener('click', () => {
  window.location.href = `pokemon.html?id=${pokemon.id}`;
});
  return card;
}

function displayPokemons(pokemons) {
  container.innerHTML = '';
  if (pokemons.length === 0) {
    container.innerHTML = `<p>No se encontraron Pokémon.</p>`;
    return;
  }
  pokemons.forEach(pokemon => {
    const card = createPokemonCard(pokemon);
    container.appendChild(card);
  });
}

async function fetchPokemons() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
    const data = await response.json();

    const pokemons = await Promise.all(
      data.results.map(async (poke) => {
        const res = await fetch(poke.url);
        const details = await res.json();

        return {
          name: poke.name,
          image: details.sprites.front_default,
          id: details.id,
          types: details.types.map(t => t.type.name)
        };
      })
    );

    allPokemons = pokemons;
    displayPokemons(allPokemons);

  } catch (error) {
    container.innerHTML = `<h1>Cargando Pokemon.</h1>`;
    console.error(error);
  }
}
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = allPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );
  displayPokemons(filtered);
});

fetchPokemons();


async function fetchTypes() {
  try {
    const res = await fetch('https://pokeapi.co/api/v2/type/');
    const data = await res.json();

    const validTypes = data.results.filter(type => !['unknown', 'shadow'].includes(type.name));

    validTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type.name;
      option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1);
      typeFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando tipos:', error);
  }
}

function filterPokemons() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedType = typeFilter.value;
  const selectedOrder = sortOrder.value;

  let filtered = allPokemons.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  if (selectedType !== 'all') {
    filtered = filtered.filter(pokemon =>
      pokemon.types.includes(selectedType)
    );
  }

  filtered.sort((a, b) => {
    switch(selectedOrder) {
      case 'id-asc':
        return a.id - b.id;
      case 'id-desc':
        return b.id - a.id;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  displayPokemons(filtered);
}
sortOrder.addEventListener('change', filterPokemons);
typeFilter.addEventListener('change', filterPokemons);
searchInput.addEventListener('input', filterPokemons);
fetchTypes();
fetchPokemons();