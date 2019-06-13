const SELECT_PLAYER_POKEMON = "SELECT_PLAYER_POKEMON";
const SELECT_ENEMY_POKEMON = "SELECT_ENEMY_POKEMON";

export function selectPlayerPokemon(pokemon) {
  return {
    type: SELECT_PLAYER_POKEMON,
    payload: pokemon,
  }
}

export function selectEnemyPokemon(pokemon) {
  return {
    type: SELECT_ENEMY_POKEMON,
    payload: pokemon,
  }
}