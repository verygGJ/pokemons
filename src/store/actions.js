const SELECT_PLAYER_POKEMON = "SELECT_PLAYER_POKEMON";
const SELECT_ENEMY_POKEMON = "SELECT_ENEMY_POKEMON";
const ADD_TO_FIGHT_LOG = "ADD_TO_FIGHT_LOG"

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

export function createFightLog(attack) {
  return {
    type: ADD_TO_FIGHT_LOG,
    payload: attack,
  }
}