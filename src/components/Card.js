// @flow

import React from "react";
import { connect } from "react-redux";
import Dropdown from "./Dropdown";
import CardInfo from "./CardInfo";
import styled from "styled-components";
import { selectPlayerPokemon, selectEnemyPokemon } from "../store/actions";
import { updateSelectedPokemon } from "../helper";

const CardWrapper = styled.div`
  max-width: 400px;
  width: 100%;
  min-height: 380px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #ccc;
  padding: 30px 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.25);
`;

type Props = {
  data: [],
  player: number,
  healthbar: number,
  fightStatus: boolean,
  updatePokemonHP: Function,
  selectPlayerPokemon: Function,
  selectEnemyPokemon: Function
}

type State = {
  pokemons: [],
  selected: Object
 };

class Card extends React.Component<Props, State> {
  state = {
    pokemons: this.props.data,
    selected: {}
  }

  handleChange = value => {
    const { pokemons } = this.state;
    const { player } = this.props;

    const selected = pokemons.find(pokemon => pokemon.id === value);

    if (player === 1) {
      this.setState({
        selected
      }, () => updateSelectedPokemon(this.props, selected, this.state.selected.maxHP));
    }
    if (player === 2) {
      this.setState({
        selected
      }, () => updateSelectedPokemon(this.props, selected, this.state.selected.maxHP));
    }
  }

  render() {
    const { selected } = this.state;
    const { data, healthbar, fightStatus } = this.props;

    return (
      <React.Fragment>
        <CardWrapper>
          <Dropdown data={data} handleChange={this.handleChange} fightStatus={fightStatus}/>
          <CardInfo selected={selected} healthbar={healthbar} />
        </CardWrapper>
      </React.Fragment>
    );
  }
}


const mapStateToProps = state => ({
  playerPokemon: state.selectedPokemonsState.playerPokemon,
  enemyPokemon: state.selectedPokemonsState.enemyPokemon,
  enemyCurrentHP: state.selectedPokemonsState.enemyCurrentHP,
  playerCurrentHP: state.selectedPokemonsState.playerCurrentHP
});

const mapDispatchToProps = dispatch => ({
  selectPlayerPokemon: pokemon => {
    dispatch(selectPlayerPokemon(pokemon));
  },
  selectEnemyPokemon: pokemon => {
    dispatch(selectEnemyPokemon(pokemon));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Card);
