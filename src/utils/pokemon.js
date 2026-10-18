export function normalizePokemon(pokemon) {
  const stats = pokemon.stats.reduce((result, item) => {
    result[item.stat.name] = item.base_stat;
    return result;
  }, {});

  const artwork =
    pokemon.sprites.other?.["official-artwork"]?.front_default;

  return {
    id: pokemon.id,
    name: pokemon.name,
    image: artwork || pokemon.sprites.front_default,
    types: pokemon.types.map((item) => item.type.name),
    height: pokemon.height / 10,
    weight: pokemon.weight / 10,
    attack: stats.attack || 0,
    stats,
  };
}

export function filterPokemon(pokemonList, query, selectedType) {
  const normalizedQuery = query.trim().toLowerCase();

  return pokemonList.filter((pokemon) => {
    const matchesName =
      pokemon.name.toLowerCase().includes(normalizedQuery);

    const matchesNumber =
      normalizedQuery !== "" &&
      String(pokemon.id) === normalizedQuery.replace(/^#/, "");

    const matchesType =
      selectedType === "all" || pokemon.types.includes(selectedType);

    return (matchesName || matchesNumber || normalizedQuery === "") &&
      matchesType;
  });
}

export function formatName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}