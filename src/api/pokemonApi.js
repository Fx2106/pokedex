const API_URL = "https://pokeapi.co/api/v2";
const CACHE_DURATION = 24 * 60 * 60 * 1000;

function readCache(key) {
  try {
    const cached = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const parsed = JSON.parse(cached);
    const isFresh = Date.now() - parsed.timestamp < CACHE_DURATION;

    return isFresh ? parsed.data : null;
  } catch {
    return null;
  }
}

function saveCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    );
  } catch {
    // La aplicación también funciona si localStorage no está disponible.
  }
}

async function fetchJson(url, cacheKey) {
  const cachedData = readCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error al consultar la API: ${response.status}`);
  }

  const data = await response.json();

  saveCache(cacheKey, data);

  return data;
}

export function getPokemonList(limit = 151) {
  const url = `${API_URL}/pokemon?limit=${limit}&offset=0`;

  return fetchJson(url, `pokedex-list-${limit}`);
}

export function getPokemonDetails(url) {
  return fetchJson(url, `pokedex-detail-${url}`);
}