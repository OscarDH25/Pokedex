const listaPokemon = document.getElementById("listaPokemon");

const URL = "https://pokeapi.co/api/v2/pokemon/";


for (let i = 1; i < 1011; i++) {
    fetch(URL + i)
        .then((response) => response.json())
        .then(data => mostrarPokemon(data))

}

function aplicarNums(pokemonID) {
    if (pokemonID.length === 1) {
        pokemonID = "00" + pokemonID;
    } else if (pokemonID.length === 2) {
        pokemonID = "0" + pokemonID;
    }

    return pokemonID;
}

function mostrarPokemon(data) {

    let tipos = data.types.map(type => ` <p class="${type.type.name} tipo">${type.type.name}</p>`)
    console.log(tipos);
    tipos = tipos.join(" ");
    let pokemonID = data.id.toString();
    pokemonID = aplicarNums(pokemonID);

    const div = document.createElement("div");
    div.classList.add("pokemon");
    div.innerHTML = `<div class="pokemon">
    <p class="pokemon-id-back">${"#" + pokemonID}</p>
    <div class="pokemon-img">
      <img
        src="${data.sprites.other["official-artwork"].front_default}"
        alt="${data.name}"
      />
    </div>
    <div class="pokemon-info">
      <div class="nombre-contenedor">
        <p class="pokemon-id">${"#" + pokemonID}</p>
        <h2 class="pokemon-nombre">${data.name}</h2>
      </div>
      <div class="pokemon-tipos " >
        ${tipos}
      </div>
      <div class="pokemon-stats">
        <p class="stats">Altura: ${data.height} </p>
        <p class="stats">Peso: ${data.weight} </p>
      </div>
    </div>
  </div>` ;
    listaPokemon.append(div);
    return div;
}

const botones = document.querySelectorAll(".boton-header");
botones.forEach(boton => boton.addEventListener("click", function (event) {
    const botonId = event.currentTarget.id;
    listaPokemon.innerHTML = "";
    for (let i = 1; i < 1011; i++) {
        fetch(URL + i)
            .then((response) => response.json())
            .then(data => {
                if (botonId === "ver-todos") {
                    mostrarPokemon(data);
                } else {
                    const tipos = data.types.map(type => type.type.name);
                    if (tipos.some(tipo => tipo.includes(botonId))) {
                        mostrarPokemon(data);
                    };
                }
            })
    }
}));




const buscar = document.getElementById("buscar");
buscar.addEventListener("click", function () {
    const pokemonBuscado = document.getElementById("pokename").value.toLowerCase();

    listaPokemon.innerHTML = "";
    let encontrado = false;

    // Crear un array para almacenar todas las promesas fetch
    const fetchPromises = [];

    for (let i = 1; i < 1011; i++) {
        fetchPromises.push(
            fetch(URL + i)
                .then((response) => response.json())
                .then(data => {
                    const nombre = data.name;

                    if (nombre === pokemonBuscado) {
                        encontrado = true;
                        mostrarPokemon(data);
                    }
                })
        );
    }

    // Esperar a que todas las promesas fetch se completen
    Promise.all(fetchPromises)
        .then(() => {
            if (encontrado === false) {
                window.location.href = "index.html";
                alert("El pokemon no existe");
            }
        });
});
