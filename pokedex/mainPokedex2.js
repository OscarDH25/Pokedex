// main.js

let isOn, haveResult, btn_shiny, btn_zoomIn, btn_zoomOut, btn_go, div_screen,
  div_data, btn_on, img, disabledElements, btn_clear, textId, textMoves, textStats, textName, textAbility, textType, param, div_light, div_tutorial, div_error;

document.addEventListener('DOMContentLoaded', function () {
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
  textMoves = document.getElementById('text_moves');
  textStats = document.getElementById('text_stats');
  param = document.getElementById('pokeInput');
  div_light = document.getElementById('div_light');
  div_tutorial = document.getElementById('div_tutorial');
  div_error = document.getElementById('div_error');
  disabledElements = document.querySelectorAll('.turnOnOff');

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

  const pokemonId = obtenerDatosPokemonDeURL();
  param.value = pokemonId;
});


function ajaxSuccess(data) {
  let imageURI = data.sprites.front_default;
  let imageURIShiny = data.sprites.front_shiny;
  let id = data.id;
  let name = data.name;
  let ability = data.abilities;
  let type = data.types;
  let isShiny = false;
  let stats = data.stats;
  let moves = data.moves;

  img.src = imageURI;
  textId.innerHTML = id;
  textName.innerHTML = name;
  textType.innerHTML = `${type[0]?.type?.name || 'Unknown'} ${type[1]?.type?.name || ''}`;
  textMoves.innerHTML = `${moves[0]?.move?.name || ''} ${moves[1]?.move?.name || ''} ${moves[2]?.move?.name || ''} ${moves[3]?.move?.name || ''}`;
  textStats.innerHTML = `${stats[0]?.stat?.name || ''}:${stats[0]?.base_stat || ''} ${stats[1]?.stat?.name || ''}:${stats[1]?.base_stat || ''} ${stats[2]?.stat?.name || ''}:${stats[2]?.base_stat || ''}`;
  textAbility.innerHTML = `${ability[0]?.ability?.name || ''} ${ability[1]?.ability?.name || ''} ${ability[2]?.ability?.name || ''}`;



  hideLoader();

  btn_shiny.addEventListener('click', function () {
    if (!haveResult) { return; }
    if (!isShiny) {
      btn_shiny.innerHTML = "Shiny!";
      btn_shiny.style.background = 'linear-gradient(#ffdb58, #ffd700)';
      img.src = imageURIShiny;
      isShiny = true;
    } else {
      btn_shiny.innerHTML = "Normal";
      btn_shiny.style.background = 'linear-gradient(#68d71d, #16a10e)';
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
    randomNumbersData();
    div_screen.classList.add("is-enabled");
    btn_on.innerHTML = "OFF";
    isOn = true;
    
    setTimeout(function () {
      const clickEvent = new MouseEvent('click', {
      });
      btn_go.dispatchEvent(clickEvent);
    }, 500);

  } else {
    disableElements();
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
  textMoves.innerHTML = '';
  textStats.innerHTML = '';
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
  if (!isOn) {
    return;
  }
  let inputValue = param.value.trim();
  if (inputValue === '') return;
  div_error.style.display = 'none';
  img.style.display = 'none';
  document.getElementById('div_loader').style.display = 'block';

  let pokeURL = "https://pokeapi.co/api/v2/pokemon/" + inputValue;

  fetch(pokeURL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      ajaxSuccess(data);
      haveResult = true;
    })
    .catch(error => {
      ajaxError(error);
      haveResult = false;
    });
}

function ajaxError(data) {
  hideLoader();
  clearData();
  div_error.style.display = 'block';
}

function obtenerDatosPokemonDeURL() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const pokemonDataString = urlParams.get('pokemon');
  const pokemonData = JSON.parse(decodeURIComponent(pokemonDataString));
  const idPokemon = pokemonData.id;
  return idPokemon;
}