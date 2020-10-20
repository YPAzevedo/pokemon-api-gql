const fs = require("fs");

const database = () => {
  let pokemons;

  return {
    connect: async () => {
      if (!pokemons) {
        const pokemonBuffer = await fs.promises.readFile(
          "./src/models/Pokemon/pokemons.json"
        );
        pokemons = JSON.parse(pokemonBuffer.toString());
        return pokemons;
      }
      return pokemons;
    },
  };
};

function makePokemonModel() {
  return {
    findById: async ({ id }) => {
      pokemons = await database().connect();
      return pokemons.results.filter(
        (pokemon) => id === pokemon.national_number
      );
    },
    findOne: async () => {
      pokemons = await database().connect();
      return pokemons.results[0];
    },
    findByName: async ({ name }) => {
      pokemons = await database().connect();
      return pokemons.results.filter((pokemon) =>
        pokemon.name.includes(name.toLowerCase())
      );
    },
    findPaginated: async ({ first = 10, skip = 0, search = "" }) => {
      pokemons = await database().connect();
      const pokemonsSearch = pokemons.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );
      return pokemonsSearch.slice(skip, first + skip);
    },
    count: async () => {
      pokemons = await database().connect();
      return pokemons.results.length;
    },
  };
}

module.exports = makePokemonModel();
