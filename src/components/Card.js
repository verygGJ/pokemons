import React from 'react';
import { connect } from "react-redux";
import Dropdown from './Dropdown';
import CardInfo from './CardInfo';
import styled from 'styled-components';

import { 
  selectPlayerPokemon,
  selectEnemyPokemon,
} from '../store/actions';

const CardWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #000;
`

type State = { 
  pokemons: [],
  selected: object
 };

class Card extends React.Component<State> {
  state = {
    pokemons: this.props.data,
    selected: {},
  }

  handleChange = (value) => {
    const { pokemons } = this.state;
    const { 
      selectPlayerPokemon, 
      selectEnemyPokemon, 
      updatePlayerHP,
      updateEnemyHP,
      player, 
      enemy 
    } = this.props;
    const selected = pokemons.find(pokemon => pokemon.id === value);
    if (player) {
      this.setState({ selected }, () => selectPlayerPokemon(selected));  
      updatePlayerHP(selected.maxHP) 
    }
    if (enemy) {
      this.setState({ selected }, () => selectEnemyPokemon(selected) );  
      updateEnemyHP(selected.maxHP) 
    }
  }

  render() {
    const { selected } = this.state;
    const { data } = this.props;
    
    return (
      <React.Fragment>
        <CardWrapper>
          <Dropdown data={data} handleChange={this.handleChange}/>
          <CardInfo selected={selected} />
        </CardWrapper>
      </React.Fragment>
    )
  }
}


function mapStateToProps(state) {
  return {
    playerPokemon: state.selectedPokemonsState.playerPokemon,
    enemyPokemon: state.selectedPokemonsState.enemyPokemon,
    enemyCurrentHP: state.selectedPokemonsState.enemyCurrentHP,
    playerCurrentHP: state.selectedPokemonsState.playerCurrentHP
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectPlayerPokemon: (pokemon) => {
      dispatch(selectPlayerPokemon(pokemon))
    },
    selectEnemyPokemon: (pokemon) => {
      dispatch(selectEnemyPokemon(pokemon))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);