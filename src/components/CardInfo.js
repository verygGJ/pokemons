// @flow

import React from 'react';
import styled from 'styled-components';
import Healthbar from './Healthbar';

const CardInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
const CardInfoImage = styled.div`
  display: block;
  margin: 0 auto;
`

const CardInfoName = styled.div`
  font-size: 20px;
  color: #333;
`

const CardInfo = ({ selected, healthbar }) => (
  <CardInfoWrapper>
    <CardInfoImage>
      <img src={selected.image} width="150" height="150" alt={selected.name} />
    </CardInfoImage>
    <CardInfoName>{selected.name}</CardInfoName>
    <Healthbar healthbar={healthbar} maxHP={selected.maxHP} />
  </CardInfoWrapper>
)

export default CardInfo;