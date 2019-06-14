// @flow

import React from "react";
import { Progress } from "antd";
import styled from "styled-components";

const HealthbarItem = styled.div`
  width: 280px;
`;

const HealthbarHP = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`;

type State = {
  percent: number
}

type Props = {
  healthbar: number,
  maxHP: number
}

class Healthbar extends React.Component<Props, State> {
  state = {
    percent: 100
  }

  updeteHealthbar = () => {
    const { healthbar, maxHP } = this.props;
    const result = (healthbar / maxHP) * 100;
    const finalResult = parseFloat(result.toFixed(0));

    this.setState({ percent: finalResult });
  }

  componentDidUpdate(previousProps: Props) : void {
    const { healthbar } = this.props;

    if (previousProps.healthbar !== healthbar) {
      this.updeteHealthbar();
    }
  }

  render() {
    const { percent } = this.state;
    const { healthbar } = this.props;

    return (
      <HealthbarItem>
        <HealthbarHP>
          {healthbar}
        </HealthbarHP>
        <Progress percent={percent} showInfo={false} />
      </HealthbarItem>
    );
  }
}

export default Healthbar;
