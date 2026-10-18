import "./style.css";

import { getPokemonDetails, getPokemonList } from "./api/pokemonApi.js";

import {
  filterPokemon,
  normalizePokemon,
  formatName,
} from "./utils/pokemon.js";

import { renderPokemonCards } from "./ui/render.js";

const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const typeFilter = document.querySelector("#type-filter");
const clearButton = document.querySelector("#clear-button");
const retryButton = document.querySelector("#retry-button");
const loadingStatus = document.querySelector("#loading-status");
const collectionStats = document.querySelector("#collection-stats");
const pokemonGrid = document.querySelector("#pokemon-grid");

let allPokemon = [];
let failedCount = 0;

function populateTypeFilter() {
  const types = [
    ...new Set(allPokemon.flatMap((pokemon) => pokemon.types)),
  ].sort();

  typeFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "Todos los tipos";
  typeFilter.append(allOption);

  types.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = formatName(type);
    typeFilter.append(option);
  });
}

function applyFilters() {
  const filteredPokemon = filterPokemon(
    allPokemon,
    searchInput.value,
    typeFilter.value,
  );

  renderPokemonCards(filteredPokemon, pokemonGrid);

  if (allPokemon.length === 0) {
    return;
  }

  if (filteredPokemon.length === 0) {
    loadingStatus.textContent =
      "No se han encontrado Pokémon. Prueba con otra búsqueda.";
  } else {
    loadingStatus.textContent =
      `Mostrando ${filteredPokemon.length} de ${allPokemon.length} Pokémon.`;
  }

  const attackTotal = allPokemon.reduce(
    (total, pokemon) => total + pokemon.attack,
    0,
  );

  const averageAttack = Math.round(attackTotal / allPokemon.length);

  collectionStats.textContent =
    `Ataque medio: ${averageAttack}` +
    (failedCount > 0 ? ` · ${failedCount} fichas no disponibles` : "");
}

async function loadPokemons() {
  retryButton.hidden = true;
  searchForm.querySelector("button").disabled = true;
  clearButton.disabled = true;
  typeFilter.disabled = true;

  loadingStatus.textContent = "Conectando con PokeAPI...";
  collectionStats.textContent = "";
  pokemonGrid.replaceChildren();

  try {
    const list = await getPokemonList(151);
    const loadedPokemon = [];
    failedCount = 0;

    const batchSize = 20;

    for (let index = 0; index < list.results.length; index += batchSize) {
      const batch = list.results.slice(index, index + batchSize);

      loadingStatus.textContent =
        `Cargando Pokémon... ${Math.min(index + batch.length, list.results.length)} de ${list.results.length}`;

      const results = await Promise.allSettled(
        batch.map((pokemon) => getPokemonDetails(pokemon.url)),
      );

      results.forEach((result) => {
        if (result.status === "fulfilled") {
          loadedPokemon.push(normalizePokemon(result.value));
        } else {
          failedCount++;
          console.error("No se pudo cargar un Pokémon:", result.reason);
        }
      });
    }

    allPokemon = loadedPokemon.sort((a, b) => a.id - b.id);

    if (allPokemon.length === 0) {
      throw new Error("No se ha podido cargar ningún Pokémon.");
    }

    populateTypeFilter();

    searchForm.querySelector("button").disabled = false;
    clearButton.disabled = false;
    typeFilter.disabled = false;

    applyFilters();
  } catch (error) {
    console.error(error);

    loadingStatus.textContent =
      "No se han podido cargar los Pokémon. Comprueba tu conexión e inténtalo de nuevo.";

    retryButton.hidden = false;
  } finally {
    searchForm.querySelector("button").disabled = false;
    clearButton.disabled = false;
    typeFilter.disabled = false;
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

searchInput.addEventListener("input", applyFilters);

typeFilter.addEventListener("change", applyFilters);

clearButton.addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "all";
  applyFilters();
});

retryButton.addEventListener("click", loadPokemons);

loadPokemons();