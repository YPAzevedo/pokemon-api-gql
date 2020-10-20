const { ApolloServer, gql } = require("apollo-server");
const PokemonModel = require("./models/Pokemon/PokemonModel");

const typeDefs = gql`
  type Query {
    pokemonById(input: PokemonFindByIdInput!): [Pokemon]!
    pokemonByName(input: PokemonFindByNameInput!): [Pokemon]!
    pokemonPagination(input: PokemonPaginationInput!): PokemonPagination!
  }

  input PokemonFindByIdInput {
    id: String
  }

  input PokemonFindByNameInput {
    name: String
  }

  input PokemonPaginationInput {
    first: Int
    skip: Int
    search: String
  }

  type PokemonPagination {
    totalCount: Int!
    count: Int!
    pokemons: [Pokemon]!
    hasMore: Boolean
  }

  type Pokemon {
    national_number: String!
    evolution: Evolution
    sprites: Sprites
    name: String!
    type: [String!]!
    total: Int!
    hp: Int!
    attack: Int!
    defense: Int!
    sp_atk: Int!
    sp_def: Int!
    speed: Int!
  }

  type Evolution {
    name: String!
  }

  type Sprites {
    normal: String!
    large: String!
    animated: String!
  }
`;

const resolvers = {
  Query: {
    pokemonById: async (parent, args) =>
      await PokemonModel.findById(args.input),
    pokemonByName: async (parent, args) =>
      await PokemonModel.findById(args.input),
    pokemonPagination: async (parent, args) => {
      const pokemons = await PokemonModel.findPaginated(args.input);
      const count = await PokemonModel.count();
      const pagniationInfo = {
        skip: args.input.skip || 0,
        first: args.input.first || 0,
      };
      return {
        totalCount: count,
        count: pokemons.length,
        pokemons,
        hasMore: pagniationInfo.first + pagniationInfo.skip < count,
      };
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen()
  .then(({ url }) => console.log(`Server listening at: ${url} 🧙‍♂️`));
