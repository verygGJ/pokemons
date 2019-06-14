// @flow

import React from "react";
import _ from "lodash";
import styled from "styled-components";
import Healthbar from "./Healthbar";
import placeholder from "../data/placeholder.png";

const CardInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const CardInfoImage = styled.div`
  display: block;
  width: 150px;
  height: 150px;
  margin: 0 auto 15px;
`;

const CardInfoName = styled.div`
  font-size: 20px;
  color: #333;
  margin: 0 auto 10px;
  font-weight: bold;
  color: #d22929;
  text-transform: uppercase;
`;
type Props = {
  selected: Object,
  healthbar: number,
}

const CardInfo = (props: Props) => {
  const { selected, healthbar } = props;

  return (
    <CardInfoWrapper>
      <CardInfoImage>
        { _.isEmpty(selected, true)
          ? <img src={placeholder} width="150" height="150" alt="placeholder" />
          : <img src={selected.image} width="150" height="150" alt={selected.name} />
        }
      </CardInfoImage>
      <CardInfoName>
        { _.isEmpty(selected, true) ? "Pick your Pokemon" : `${selected.name}` }
      </CardInfoName>
      { _.isEmpty(selected, true) ? "" : <Healthbar healthbar={healthbar} maxHP={selected.maxHP} /> }
    </CardInfoWrapper>
  );
};

export default CardInfo;
