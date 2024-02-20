const listaPokemon = document.getElementById("listaPokemon");
const URL = "https://pokeapi.co/api/v2/pokemon/";
const totalPokemons = 1017;

cargarYMostrarPokemons();

async function cargarYMostrarPokemons() {
  for (let i = 1; i <= totalPokemons; i++) {
    await fetch(URL + i)
      .then((response) => response.json())
      .then((data) => mostrarPokemon(data));
  }
}

const botones = document.querySelectorAll(".boton-header");

botones.forEach((boton) =>
  boton.addEventListener("click", async function (event) {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";

    const pokemonDataArray = await obtenerDatosDePokemons();

    for (const data of ordenarPorId(pokemonDataArray)) {
      if (botonId === "ver-todos" || incluyeTipo(data, botonId)) {
        mostrarPokemon(data);
      }
    }
  })
);

async function obtenerDatosDePokemons() {
  const fetchPromises = Array.from({ length: totalPokemons }, (_, i) =>
    fetch(URL + (i + 1)).then((response) => response.json())
  );
  return Promise.all(fetchPromises);
}

function ordenarPorId(pokemonDataArray) {
  return pokemonDataArray.sort((a, b) => a.id - b.id);
}

function incluyeTipo(data, tipo) {
  return data.types.map((type) => type.type.name).includes(tipo);
}

function aplicarNums(pokemonID) {
  if (pokemonID.length === 1) {
    return "00" + pokemonID;
  } else if (pokemonID.length === 2) {
    return "0" + pokemonID;
  }
  return pokemonID;
}

function mostrarPokemon(data) {
  const link = document.createElement("a");
  link.href = `./pokedex/indexPokedex.html?pokemon=${encodeURIComponent(
    JSON.stringify(data)
  )}`;
  link.style.textDecoration = "none";

  const tipos = data.types
    .map((type) => ` <p class="${type.type.name} tipo">${type.type.name}</p>`)
    .join(" ");
  const pokemonID = aplicarNums(data.id.toString());

  const div = document.createElement("div");
  div.classList.add("pokemon");
  div.innerHTML = `<div class="pokemon">
        <p class="pokemon-id-back">${"#" + pokemonID}</p>
        <div class="pokemon-img">
            <img src="${
              data.sprites.other["official-artwork"].front_default
            }" alt="${data.name}" />
        </div>
        <br>
        <div class="pokemon-info">
            <div class="nombre-contenedor">
                <p class="pokemon-id">${"#" + pokemonID}</p>
                <h2 class="pokemon-nombre">${data.name}</h2>
            </div>
            <div class="pokemon-tipos ">
                ${tipos}
            </div>
            <div class="pokemon-stats">
                <p class="stats">Altura: ${data.height} </p>
                <p class="stats">Peso: ${data.weight} </p>
            </div>
        </div>
    </div>`;

  link.appendChild(div);
  listaPokemon.append(link);

  return div;
}
