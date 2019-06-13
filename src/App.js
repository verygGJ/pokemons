// @flow

import React from 'react';
import { connect } from "react-redux";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import _ from 'lodash';
import Card from './components/Card';
import FightMessage from './components/FightMessage';
import styled from 'styled-components'
import { Button } from 'antd';
import 'antd/dist/antd.css';


const Wrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 50px auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

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
  player: boolean,
  enemy: boolean,
  playerHP: number,
  enemyHP: number,
  winnerMessage: string,
  gameOver: boolean,
  fightStatus: boolean
 };

class App extends React.Component<Props, State> {
  state = {
    player: true,
    playerHP: 0,
    enemy: true,
    enemyHP: 0,
    winnerMessage: '',
    gameOver: false,
    allAttacks: [],
    fightStatus: false,
  }

  updatePlayerHP = (hp) => {
    this.setState({ playerHP: hp })
  }

  updateEnemyHP = (hp) => {
    this.setState({ enemyHP: hp })
  }

  fightValidate = () => {
    const { playerPokemon, enemyPokemon } = this.props;
    return playerPokemon.hasOwnProperty('id') && enemyPokemon.hasOwnProperty('id');
  }

  resistantAttackValidate = (randomeAttack, target) => {
    let resistantAttack = target.resistant.some(item => randomeAttack.type.indexOf(item) >= 0)
    let AttackDamage;
    
    if (resistantAttack) {
      randomeAttack.damage = 0;
      AttackDamage = randomeAttack.damage;
    } else {
      AttackDamage = randomeAttack.damage;
    }
    
    return AttackDamage;
  }

  playerPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { attacks, name } = playerPokemon;
    let pokemonAtacks = [];
    pokemonAtacks.push(...attacks.fast);
    pokemonAtacks.push(...attacks.special);
    let randomeAttack = _.sample(pokemonAtacks);
    let playerAttackDamage = this.resistantAttackValidate(randomeAttack, enemyPokemon);
    playerAttackDamage = playerAttackDamage * 10;

    randomeAttack.newdmg = playerAttackDamage;
    allAttacks.push(randomeAttack)
    
    this.setState(prevState => {
      if (prevState.enemyHP - playerAttackDamage <= 0) {
        return {
          enemyHP: 0,
          gameOver: true,
          winnerMessage: `${name} WIN`
        }
      } else {
        return {
          enemyHP: prevState.enemyHP - playerAttackDamage,
          fightStatus: true,
          allAttacks: allAttacks
        }
      }
    });
  };
  
  enemyPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { attacks } = enemyPokemon;
    let pokemonAtacks = [];
    pokemonAtacks.push(...attacks.fast);
    pokemonAtacks.push(...attacks.special);
    
    let randomeAttack = _.sample(pokemonAtacks);
    let enemyAttackDamage = this.resistantAttackValidate(randomeAttack, playerPokemon);
    enemyAttackDamage = enemyAttackDamage * 10;
    
    randomeAttack.newdmg = enemyAttackDamage;
    allAttacks.push(randomeAttack)
    
    this.setState(prevState => {
      if (prevState.playerHP - enemyAttackDamage <= 0) {
        return {
          playerHP: 0,
          gameOver: true,
          winnerMessage: `${enemyPokemon.name} WIN`
        }
      } else {
        return {
          playerHP: prevState.playerHP - enemyAttackDamage,
          fightStatus: true,
          allAttacks: allAttacks
        }
      }
    });
  }
  
  startFight = () => {
    const { enemyHP, playerHP } = this.state;
    setTimeout(() => {
      if (enemyHP > 0 && playerHP > 0  ) {
        this.playerPokemonAttacks();
        if (enemyHP > 0 && playerHP > 0) {
          setTimeout(() => {
            this.enemyPokemonAttacks();
          }, 1000)
        }
        setTimeout(this.startFight(), 1000);
      }
    }, 2000);
  }

  restartFight = () => {
    const { playerPokemon, enemyPokemon } = this.props;
    this.setState({
      fightStatus: false,
      playerHP: playerPokemon.maxHP,
      enemyHP: enemyPokemon.maxHP,
      winnerMessage: '',
      gameOver: false,
      allAttacks: [],
    })
  }

  render() {
    const { 
      player, 
      enemy, 
      enemyAttacks, 
      playerAttacks,
      winnerMessage,
      allAttacks,
      playerHP,
      enemyHP,
      fightStatus,
      gameOver
    } = this.state;

    return (
      <Query query={GET_POKEMONS}>
        {({ data: { pokemons }, loading }) => {
          if (loading || !pokemons) {
            return <div>Loading ...</div>;
          }
          return (
            <React.Fragment>
              <Wrapper>
                <Card 
                  data={pokemons} 
                  player={player} 
                  updatePlayerHP={this.updatePlayerHP} 
                  healthbar={playerHP} 
                  fightStatus={fightStatus}
                  />
                <Button 
                  disabled={!this.fightValidate() || fightStatus}
                  onClick={this.startFight}
                >
                  { this.fightValidate() ? 'Fight' : 'Pick Pokemons' }
                </Button>
                <Card 
                  data={pokemons} 
                  enemy={enemy} 
                  updateEnemyHP={this.updateEnemyHP} 
                  healthbar={enemyHP} 
                  fightStatus={fightStatus} 
                />
              </Wrapper>

              <FightMessage 
                playerAttacks={playerAttacks} 
                enemyAttacks={enemyAttacks} 
                allAttacks={allAttacks}
                winnerMessage={winnerMessage}
              />
              { gameOver ? <Button onClick={this.restartFight} >Restart Fight</Button> : '' }
            </React.Fragment>
          );
        }}
      </Query>
    )
  }
}

function mapStateToProps(state) {
  return {
    playerPokemon: state.selectedPokemonsState.playerPokemon,
    enemyPokemon: state.selectedPokemonsState.enemyPokemon,
  }
}

export default connect(mapStateToProps)(App);