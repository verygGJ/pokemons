import _ from "lodash";

export const updateSelectedPokemon = (props, pokemon, selectedHP) => {
  const { player, updatePokemonHP } = props;

  if (player === 1) {
    props.selectPlayerPokemon(pokemon);
    updatePokemonHP(selectedHP);
  }
  if (player === 2) {
    props.selectEnemyPokemon(pokemon);
    updatePokemonHP(selectedHP);
  }
};

export const fightValidate = props => {
  const { playerPokemon, enemyPokemon } = props;

  return _.isEmpty(playerPokemon, true) || _.isEmpty(enemyPokemon, true);
};

const resistantAttackValidate = (randomeAttack, target) => {
  const resistantAttack = target.resistant.some(item => randomeAttack.type.indexOf(item) >= 0);
  let AttackDamage;

  if (resistantAttack) {
    randomeAttack.damage = 0;
    AttackDamage = randomeAttack.damage;
  } else {
    AttackDamage = randomeAttack.damage;
  }
  return AttackDamage;
};

export const updatePokemonAtacks = (allAttacks, attackingPlayer, defenderPlayer) => {
  const { attacks } = attackingPlayer;
  const pokemonAtacks = [];

  pokemonAtacks.push(...attacks.fast);
  pokemonAtacks.push(...attacks.special);
  const randomeAttack = _.sample(pokemonAtacks);
  let playerAttackDamage = resistantAttackValidate(randomeAttack, defenderPlayer);

  playerAttackDamage *= 10;
  randomeAttack.newdmg = playerAttackDamage;
  allAttacks.push(randomeAttack);
  return playerAttackDamage;
};
