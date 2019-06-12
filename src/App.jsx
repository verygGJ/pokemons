import React from 'react';
import { connect } from "react-redux";
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import _ from 'lodash';

import { createFightLog } from './store/actions';


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
  align-items: flex-start;
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
  playerPokemon: object,
  enemyPokemon: object
 };

type State = { 
  player: boolean,
  enemy: boolean,
  playerAttacks: [],
  playerHP: number,
  enemyHP: number,
  enemyAttacks: [],
  fightMessageOne: String,
  fightMessageTwo: String,
  gameOver: boolean
 };

class App extends React.Component<Props, State> {
  state = {
    player: true,
    playerHP: 0,
    enemy: true,
    enemyHP: 0,
    fightMessageOne: '',
    fightMessageTwo: '',
    gameOver: false,
    allAttacks: [],
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
  
  playerPokemonAttacks = () => {
    const { allAttacks } = this.state;
    const { playerPokemon, enemyPokemon } = this.props;
    const { attacks, name } = playerPokemon;

    let pokemonAtacks = [];
    pokemonAtacks.push(...attacks.fast);
    pokemonAtacks.push(...attacks.special);
    const randomeAttack = _.sample(pokemonAtacks);


    let resistantAttack = enemyPokemon.resistant.some(item => randomeAttack.type.indexOf(item) >= 0)
    let playerAttackDamage;   
    if (resistantAttack) {
      let blockValue = Math.random() * 100;
      if (blockValue < 25) {
        randomeAttack.damage = 0;
      }
    }

    playerAttackDamage = randomeAttack.damage;
    allAttacks.push(randomeAttack)


    this.setState(prevState => {
      if (prevState.enemyHP - playerAttackDamage <= 0) {
        return {
          enemyHP: 0,
          gameOver: true,
          fightMessageOne: `${name} WIN`
        }
      } else {
        return {
          enemyHP: prevState.enemyHP - playerAttackDamage,
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
    const randomeAttack = _.sample(pokemonAtacks);


    let resistantAttack = playerPokemon.resistant.some(item => randomeAttack.type.indexOf(item) >= 0)
    let enemyAttackDamage;   
    if (resistantAttack) {
      let blockValue = Math.random() * 100;
      if (blockValue < 25) {
        randomeAttack.damage = 0;
      }
    }

    enemyAttackDamage = randomeAttack.damage;
    allAttacks.push(randomeAttack)
    
    this.setState(prevState => {
      if (prevState.playerHP - enemyAttackDamage <= 0) {
        return {
          playerHP: 0,
          gameOver: true,
          fightMessageOne: `${enemyPokemon.name} WIN`
        }
      } else {
        return {
          playerHP: prevState.playerHP - enemyAttackDamage,
          allAttacks: allAttacks
        }
      }
    });
  }

  startFight = () => {
    // const { playerHP, enemyHP } = this.state;
    
    this.playerPokemonAttacks();
    this.enemyPokemonAttacks();
    // setInterval(() => {
    //   if (playerHP > 0 && enemyHP > 0 ) {
    //     this.playerPokemonAttacks();
    //     this.enemyPokemonAttacks();
    //   } else {
    //     this.setState({ gameOver: true });
    //   }
    // }, 1000);
  }

  render() {
    const { 
      player, 
      enemy, 
      enemyAttacks, 
      playerAttacks,
      fightMessageOne,
      allAttacks
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
                <Card data={pokemons} player={player} updatePlayerHP={this.updatePlayerHP} />
                <Card data={pokemons} enemy={enemy} updateEnemyHP={this.updateEnemyHP} />
              </Wrapper>
              
              <Button 
                disabled={!this.fightValidate()}
                onClick={this.startFight}
              >
                { this.fightValidate() ? 'Fight' : 'Pick Pokemons' }
              </Button>

              <FightMessage 
                playerAttacks={playerAttacks} 
                enemyAttacks={enemyAttacks} 
                allAttacks={allAttacks}
                fightMessageOne={fightMessageOne}
              />

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

function mapDispatchToProps(dispatch) {
  return {
    createFightLog: (log) => {
      dispatch(createFightLog(log))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);