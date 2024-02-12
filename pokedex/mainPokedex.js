let isOn, haveResult, btn_shiny, btn_zoomIn, btn_zoomOut, btn_go, div_screen,
  div_data, btn_on, img, disabledElements, btn_clear, textId, textName, textAbility, textType, param, div_light, div_tutorial, div_error;

document.addEventListener('DOMContentLoaded', function () {
  obtenerDatosPokemonDeURL();
  isOn = false;
  haveResult = false;
  img = document.getElementById('img');
  btn_shiny = document.getElementById('btn_shiny');
  btn_zoomIn = document.getElementById('btn_zoom-in');
  btn_zoomOut = document.getElementById('btn_zoom-out');
  btn_go = document.getElementById('btn_go');
  div_screen = document.getElementById('div_screen');
  div_data = document.getElementById('div_data');
  btn_on = document.getElementById('btn_on');
  btn_clear = document.getElementById('btn_clear');
  textId = document.getElementById('text_id');
  textName = document.getElementById('text_name');
  textAbility = document.getElementById('text_ability');
  textType = document.getElementById('text_type');
  param = document.getElementById('pokeInput');
  div_light = document.getElementById('div_light');
  div_tutorial = document.getElementById('div_tutorial');
  div_error = document.getElementById('div_error');
  disabledElements = document.querySelectorAll('.turnOnOff');

  // Obtener los parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const pokemonParam = urlParams.get('pokemon');

  // Verificar si se proporcionó el parámetro 'pokemon'
  if (pokemonParam) {
    try {
      // Decodificar el JSON almacenado en el parámetro 'pokemon'
      const pokemonData = JSON.parse(decodeURIComponent(pokemonParam));

      // Llamar a la función para mostrar el Pokémon en tu página
      mostrarPokemon(pokemonData);

      // Puedes hacer más cosas con los datos del Pokémon si es necesario
      // Por ejemplo, actualizar la interfaz gráfica con la información del Pokémon

      // Habilitar el botón de búsqueda para realizar nuevas búsquedas
      btn_go.disabled = false;

      // Habilitar la pantalla y mostrar el Pokémon
      enableElements();
      div_screen.classList.add("is-enabled");
      btn_on.innerHTML = "OFF";
      isOn = true;

    } catch (error) {
      console.error('Error al procesar el parámetro "pokemon"', error);
    }
  }

  btn_zoomIn.addEventListener('click', function () {
    if (!isOn) { return; }
    img.classList.add("zoom-in");
  });

  btn_zoomOut.addEventListener('click', function () {
    if (!isOn) { return; }
    img.classList.remove("zoom-in");
  });

  btn_on.addEventListener('click', function () {
    turnOnPokedex();
  });

  btn_go.addEventListener('click', function () {
    pokeSubmit();
  });
});

function mostrarPokemon(data) {
  let imageURI = data.sprites.front_default;
  let imageURIShiny = data.sprites.front_shiny;
  let id = data.id;
  let name = data.name;
  let ability = data.abilities;
  let type = data.types;
  let isShiny = false;

  img.src = imageURI;
  textId.innerHTML = id;
  textName.innerHTML = name;
  textAbility.innerHTML = ability[0].ability.name;
  textType.innerHTML = type[0].type.name;

  hideLoader();

  btn_shiny.addEventListener('click', function () {
    if (!haveResult) { return; }
    if (!isShiny) {
      btn_shiny.innerHTML = "Normal";
      img.src = imageURIShiny;
      isShiny = true;
    } else {
      btn_shiny.innerHTML = "Shiny";
      img.src = imageURI;
      isShiny = false;
    }
  });

  btn_clear.addEventListener('click', function () {
    clearData();
  });
}

function getRandomNumber(number) {
  param.value = number;
  pokeSubmit();
}

function enableElements() {
  disabledElements.forEach(function (element) {
    element.classList.remove('is-disabled');
  });
}

function disableElements() {
  disabledElements.forEach(function (element) {
    element.classList.add('is-disabled');
  });
}

function turnOnPokedex() {
  clearData();
  if (!isOn) {
    enableElements();
    // Aquí ya cargaste el Pokémon desde la primera página
    div_screen.classList.add("is-enabled");
    btn_on.innerHTML = "OFF";
    isOn = true;
  } else {
    disableElements()
    div_screen.classList.remove("is-enabled");
    btn_on.innerHTML = "ON";
    isOn = false;
    document.querySelectorAll(".randomNumber").forEach(function (element) {
      element.removeEventListener("click", getRandomNumber);
    });
  }
}

function clearData() {
  if (!isOn) { return; }
  haveResult = false;
  img.src = '';
  textId.innerHTML = '';
  textName.innerHTML = '';
  textAbility.innerHTML = '';
  textType.innerHTML = '';
  param.value = '';
}

function randomNumbersData() {
  document.querySelectorAll(".randomNumber").forEach(function (element) {
    let number = Math.floor(Math.random() * 100) + 1;
    element.innerHTML = number;
    element.addEventListener('click', function () {
      getRandomNumber(number);
    });
  });
}

function hideLoader() {
  document.getElementById('div_loader').style.display = 'none';
  img.style.display = 'block';
}

function pokeSubmit() {
  if (!isOn) { return; }
  let inputValue = param.value.trim();
  if (inputValue === '') return;
  div_error.style.display = 'none';
  img.style.display = 'none';
  document.getElementById('div_loader').style.display = 'block';

  // Si ya tienes los datos del Pokémon, simplemente muestra el Pokémon
  if (pokemonParam) {
    try {
      const pokemonData = JSON.parse(decodeURIComponent(pokemonParam));
      mostrarPokemon(pokemonData);
      haveResult = true;
      hideLoader();
      return;
    } catch (error) {
      console.error('Error al procesar el parámetro "pokemon"', error);
    }
  }

  // Si no tienes datos del Pokémon, realiza la búsqueda normalmente
  let pokeURL = "https://pokeapi.co/api/v2/pokemon/" + inputValue;

  fetch(pokeURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      mostrarPokemon(data);
      haveResult = true;
    })
    .catch(error => {
      ajaxError();
      haveResult = false;
    });
}

function ajaxError(data) {
  hideLoader();
  clearData();
  div_error.style.display = 'block';
}

