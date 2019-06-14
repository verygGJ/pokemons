// @flow

import React from "react";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import _ from "lodash";
import styled from "styled-components";
import { Button } from "antd";
import Card from "./components/Card";
import Preloader from "./components/Preloader";
import FightLog from "./components/FightLog";
import "antd/dist/antd.css";


const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 50px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GET_POKEMONS = gql`
  {
    pokemons(first: 10) {
      id
      number
      name
      maxHP
      image
      resistant
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
    }
  }
`;

type Props = {
  playerPokemon: Object,
  enemyPokemon: Object
 };

type State = {
  player: number,
  enemy: number,
  playerHP: number,
  enemyHP: number,
  allAttacks: Array<any>,
  winnerMessage: string,
  fightStatus: boolean,
  gameOver: boolean,
 };

class App extends React.Component<Props, State> {
  state = {
    player: 1,
    enemy: 2,
    playerHP: 0,
    enemyHP: 0,
    allAttacks: [],
    winnerMessage: "",
    fightStatus: false,
    gameOver: false
  }

  updatePlayerHP = hp => {
    this.setState({ playerHP: hp });
  }

  updateEnemyHP = hp => {
    this.setState({ enemyHP: hp });
  }

  fightValidate = () => {
    const { playerPokemon, enemyPokemon } = this.props;

    return _.isEmpty(playerPokemon, true) || _.isEmpty(enemyPokemon, true);
  }

  resistantAttackValidate = (randomeAttack, target) => {
    const resistantAttack = target.resistant.some(item => randomeAttack.type.indexOf(item) >= 0);
    let AttackDamage;

    if (resistantAttack) {
      randomeAttack.damage = 0;
      AttackDamage = randomeAttack.damage;
    } else {
      AttackDamage = randomeAttack.damage;
    }
    return AttackDamage;
  }

  updatePokemonAtacks = (attackingPlayer, defenderPlayer) => {
    const { allAttacks } = this.state;
    const { attacks } = attackingPlayer;
    const pokemonAtacks = [];

    pokemonAtacks.push(...attacks.fast);
    pokemonAtacks.push(...attacks.special);
    const randomeAttack = _.sample(pokemonAtacks);
    let playerAttackDamage = this.resistantAttackValidate(randomeAttack, defenderPlayer);

    playerAttackDamage *= 10;
    randomeAttack.newdmg = playerAttackDamage;
    allAttacks.push(randomeAttack);
    return playerAttackDamage;
  }

  playerPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { name } = playerPokemon;
    const playerAttackDamage = this.updatePokemonAtacks(playerPokemon, enemyPokemon);

    this.setState(prevState => {
      if (prevState.enemyHP - playerAttackDamage <= 0) {
        return {
          enemyHP: 0,
          gameOver: true,
          fightStatus: true,
          winnerMessage: `${name} WIN`
        };
      }
      return {
        enemyHP: prevState.enemyHP - playerAttackDamage,
        fightStatus: true,
        allAttacks
      };

    });
  };

  enemyPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { name } = enemyPokemon;
    const enemyAttackDamage = this.updatePokemonAtacks(enemyPokemon, playerPokemon);

    this.setState(prevState => {
      if (prevState.playerHP - enemyAttackDamage <= 0) {
        return {
          playerHP: 0,
          gameOver: true,
          fightStatus: true,
          winnerMessage: `${name} WIN`
        };
      }
      return {
        playerHP: prevState.playerHP - enemyAttackDamage,
        fightStatus: true,
        allAttacks
      };

    });
  }

  startFight = (e: Object): Object => {
    setTimeout(() => {
      if (!this.state.gameOver) {
        this.playerPokemonAttacks();
        if (!this.state.gameOver) {
          setTimeout(() => {
            this.enemyPokemonAttacks();
          }, 1000);
        }
        setTimeout(this.startFight(e), 1000);
      }
    }, 2000);
  }

  restartFight = () => {
    const { playerPokemon, enemyPokemon } = this.props;

    this.setState({
      fightStatus: false,
      playerHP: playerPokemon.maxHP,
      enemyHP: enemyPokemon.maxHP,
      winnerMessage: "",
      gameOver: false,
      allAttacks: []
    });
  }

  render() {
    const {
      player,
      enemy,
      winnerMessage,
      allAttacks,
      playerHP,
      enemyHP,
      fightStatus,
      gameOver
    } = this.state;

    return (
      <Query query={GET_POKEMONS}>
        {({ loading, error, data: { pokemons } }) => {
          if (loading || !pokemons) {
            return <Preloader />;
          }
          if (error) {
            return `Error! ${error.message}`;
          }
          return (
            <React.Fragment>
              <Wrapper>
                <Card
                  data={pokemons}
                  player={player}
                  healthbar={playerHP}
                  updatePokemonHP={this.updatePlayerHP}
                  fightStatus={fightStatus}
                />
                <Button
                  disabled={this.fightValidate() || fightStatus}
                  onClick={this.startFight}
                >
                  { this.fightValidate() ? "Pick Pokemons" : "Fight" }
                </Button>
                <Card
                  data={pokemons}
                  player={enemy}
                  healthbar={enemyHP}
                  updatePokemonHP={this.updateEnemyHP}
                  fightStatus={fightStatus}
                />
              </Wrapper>
              <FightLog
                allAttacks={allAttacks}
                winnerMessage={winnerMessage}
              />
              { gameOver ? <Button className="restart-button" onClick={this.restartFight} >Restart Fight</Button> : "" }
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

const mapStateToProps = state => ({
  playerPokemon: state.selectedPokemonsState.playerPokemon,
  enemyPokemon: state.selectedPokemonsState.enemyPokemon
});

export default connect(mapStateToProps)(App);
