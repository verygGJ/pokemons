// @flow

import React from "react";
import { connect } from "react-redux";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { timer } from "rxjs";
import { takeWhile, tap, delay } from "rxjs/operators";
import styled from "styled-components";
import { fightValidate, updatePokemonAtacks } from "./helper";
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

  playerPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { name } = playerPokemon;
    const playerAttackDamage = updatePokemonAtacks(allAttacks, playerPokemon, enemyPokemon);

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
    const enemyAttackDamage = updatePokemonAtacks(allAttacks, enemyPokemon, playerPokemon);

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

  startFight = () => {
    const intervalAttacks = timer(0, 2000);

    intervalAttacks.pipe(
      takeWhile(() => !this.state.gameOver),
      tap(() => this.playerPokemonAttacks()),
      delay(1000),
      takeWhile(() => !this.state.gameOver),
      tap(() => this.enemyPokemonAttacks())
    ).subscribe();
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
                  disabled={fightValidate(this.props) || fightStatus}
                  onClick={this.startFight}
                >
                  { fightValidate(this.props) ? "Pick Pokemons" : "Fight" }
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
