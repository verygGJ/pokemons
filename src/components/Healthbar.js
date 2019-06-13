// @flow

import React from 'react';
import { Progress } from 'antd';
import styled from 'styled-components';

const HealthbarItem = styled.div`
  width: 280px;
`
const HealthbarHP = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
`

type State = { 
  percent: Number
}

type Props = { 
  healthbar: Number,
  maxHP: Number
}

class Healthbar extends React.Component<Props, State> {
  state = {
    percent: 100,
  }

  updeteHealthbar = () => {
    const { healthbar, maxHP } = this.props;
    let result = (healthbar / maxHP) * 100;
    let finalResult = parseFloat(result.toFixed(0))
    this.setState({ percent: finalResult });
  }

  componentDidUpdate(previousProps, previousState) {
    if (previousProps.healthbar !== this.props.healthbar) {
      this.updeteHealthbar();
    }
  }

  render() {
    const { percent } = this.state;
    const {healthbar} = this.props
    return (
      <HealthbarItem>
        <HealthbarHP>
          {healthbar}
        </HealthbarHP>
        <Progress percent={percent} showInfo={false} />
      </HealthbarItem>
    )
  }
}

export default Healthbar;