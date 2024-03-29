const initialState = {
  playerPokemon: {},
  enemyPokemon: {}
};

export const selectedPokemonsState = (state = initialState, action) => {
  switch (action.type) {
  case "SELECT_PLAYER_POKEMON":
    return {
      ...state,
      playerPokemon: action.payload
    };
  case "SELECT_ENEMY_POKEMON":
    return {
      ...state,
      enemyPokemon: action.payload
    };
  default:
    return state;
  }
};
