import React from 'react';
import styled from 'styled-components'

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

const CardInfoHP = styled.div`
  color: red;
`

const CardInfo = ({ selected }) => (
  <CardInfoWrapper>
    <CardInfoImage>
      <img src={selected.image} width="90" height="90" alt={selected.name}/>
    </CardInfoImage>
    <CardInfoName>{selected.name}</CardInfoName>
    <CardInfoHP>{selected.maxHP}</CardInfoHP>
  </CardInfoWrapper>
)

export default CardInfo;