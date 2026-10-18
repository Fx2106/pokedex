import { formatName } from "../utils/pokemon.js";

export function renderPokemonCards(pokemonList, container) {
  const fragment = document.createDocumentFragment();

  pokemonList.forEach((pokemon) => {
    const card = document.createElement("article");
    card.className = "pokemon-card";

    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";

    const number = document.createElement("span");
    number.className = "pokemon-number";
    number.textContent = `#${String(pokemon.id).padStart(3, "0")}`;

    cardHeader.append(number);

    const imageContainer = document.createElement("div");
    imageContainer.className = "pokemon-image-container";

    const image = document.createElement("img");
    image.className = "pokemon-image";
    image.alt = formatName(pokemon.name);
    image.loading = "lazy";

    const fallback = document.createElement("span");
    fallback.className = "image-fallback";
    fallback.textContent = "⚡";
    fallback.hidden = true;

    if (pokemon.image) {
      image.src = pokemon.image;

      image.addEventListener(
        "error",
        () => {
          image.hidden = true;
          fallback.hidden = false;
        },
        { once: true },
      );
    } else {
      image.hidden = true;
      fallback.hidden = false;
    }

    imageContainer.append(image, fallback);

    const name = document.createElement("h3");
    name.className = "pokemon-name";
    name.textContent = formatName(pokemon.name);

    const typesContainer = document.createElement("div");
    typesContainer.className = "pokemon-types";

    pokemon.types.forEach((type) => {
      const badge = document.createElement("span");
      badge.className = `type-badge type-${type}`;
      badge.textContent = formatName(type);
      typesContainer.append(badge);
    });

    const details = document.createElement("div");
    details.className = "pokemon-details";

    const height = document.createElement("p");
    height.innerHTML = "";

    const heightLabel = document.createElement("span");
    heightLabel.textContent = "Altura";

    const heightValue = document.createElement("strong");
    heightValue.textContent = `${pokemon.height.toFixed(1)} m`;

    height.append(heightLabel, heightValue);

    const weight = document.createElement("p");

    const weightLabel = document.createElement("span");
    weightLabel.textContent = "Peso";

    const weightValue = document.createElement("strong");
    weightValue.textContent = `${pokemon.weight.toFixed(1)} kg`;

    weight.append(weightLabel, weightValue);

    const attack = document.createElement("p");

    const attackLabel = document.createElement("span");
    attackLabel.textContent = "Ataque";

    const attackValue = document.createElement("strong");
    attackValue.textContent = String(pokemon.attack);

    attack.append(attackLabel, attackValue);

    details.append(height, weight, attack);
    card.append(cardHeader, imageContainer, name, typesContainer, details);
    fragment.append(card);
  });

  container.replaceChildren(fragment);
}