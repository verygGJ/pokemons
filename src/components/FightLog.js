// @flow

import React from "react";
import styled from "styled-components";
import AttackMessage from "./AttackMessage";

const FightLogWrapper = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 50px auto;
`;

const WinnerBlock = styled.div`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  margin: 50px auto;
`;

type Props = {
  winnerMessage: string,
  allAttacks: Array<any>,
}

const FightLog = (props: Props) => {
  const { winnerMessage, allAttacks } = props;

  return (
    <FightLogWrapper>
      {allAttacks.map((attack, index) => {
        const playerName = index % 2 ? "Player 2" : "Player 1";
        const attackIsResist = attack.newdmg <= 0 ? "Resist Attack" : `- ${attack.newdmg} HP!`;
        const arrowDirection = index % 2 ? "<=====" : "=====>";

        return (
          <AttackMessage
            key={index}
            attack={attack}
            index={index}
            playerName={playerName}
            attackIsResist={attackIsResist}
            arrowDirection={arrowDirection}
          />
        );
      })}
      <WinnerBlock>{winnerMessage}</WinnerBlock>
    </FightLogWrapper>
  );
};

export default FightLog;
