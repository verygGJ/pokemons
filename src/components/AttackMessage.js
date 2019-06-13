// @flow

import React from 'react';
import styled from 'styled-components';
import '../styles.css';

const FightItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const FightItemLeft = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 400px;
  width: 100%;
  height: 50px;
  background: #c9f5c9;
  align-items: center;
  justify-content: center;
  border: 1px solid #59e759;
  border-radius: 10px;
`

const FightItemArrow = styled.div`
  display: flex;
`

const FightItemRight = styled.div`
  max-width: 400px;
  width: 100%;
  height: 50px;
  background: ${props => props.resist ? "yellow" : "pink"};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid ${props => props.resist ? "#ceda2f" : "#f17087"};
  border-radius: 10px;
`

type Props = { 
  attack: Object,
  index: number,
  playerName: string,
  attackIsResist: string,
  arrowDirection: string
}

const AttackMessage = (props: Props) => {
  const { attack, index, playerName, attackIsResist, arrowDirection } = props;
  return (
    <FightItem className={ index%2 ? 'reverse' : '' }>
      <FightItemLeft>
        {playerName} used {attack.name}
      </FightItemLeft>
      <FightItemArrow> {arrowDirection} </FightItemArrow>
      <FightItemRight resist={attack.newdmg <= 0 ? attackIsResist : ''} >
        {attackIsResist}
      </FightItemRight>
    </FightItem>
  )
}

export default AttackMessage;