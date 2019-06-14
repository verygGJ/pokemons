const SELECT_PLAYER_POKEMON = "SELECT_PLAYER_POKEMON";
const SELECT_ENEMY_POKEMON = "SELECT_ENEMY_POKEMON";

export const selectPlayerPokemon = pokemon => ({
  type: SELECT_PLAYER_POKEMON,
  payload: pokemon
});

export const selectEnemyPokemon = pokemon => ({
  type: SELECT_ENEMY_POKEMON,
  payload: pokemon
});
