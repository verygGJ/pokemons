import React from 'react';
import styled from 'styled-components';
import '../styles.css';

const FightLog = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 50px auto;
`

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
  background: pink;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #f17087;
  border-radius: 10px;
`
const WinnerBlock = styled.div`
  font-size: 30px;
  text-align: center;
  font-weight: bold;
  margin: 50px auto;
`

// const AttackMessage = ({ attack, index }) => {
//   return (
//     <FightItem>
//       <FightItemLeft>
//         Player {index} used {attack.name}
//       </FightItemLeft>
//       <FightItemArrow> ====> </FightItemArrow>
//       <FightItemRight>
//         - {attack.damage} HP!
//       </FightItemRight>
//     </FightItem>
//   )
// }


class FightMessage extends React.Component {
  
  render() {
    const { fightMessageOne, allAttacks } = this.props;

    return(
      <FightLog>
        {allAttacks.map((attack, index) => {
          const playerName = index%2 ? 'Player 2' : 'Player 1';
          const block = attack.damage <= 0 ? 'ЗАБЛОЧЕНО' : `- ${attack.damage} HP!`;
          return (
            <FightItem key={index} className={ index%2 ? 'reverse' : '' }>
              <FightItemLeft>
                {playerName} used {attack.name}
              </FightItemLeft>
              <FightItemArrow> ====> </FightItemArrow>
              <FightItemRight>
                {block}
              </FightItemRight>
            </FightItem>
          ) 
        })}
        <WinnerBlock>{fightMessageOne}</WinnerBlock>
      </FightLog>
    )
  }
}


export default FightMessage;