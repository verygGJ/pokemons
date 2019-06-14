// @flow

import React from "react";
import { Select } from "antd";
import "antd/dist/antd.css";

type Props = {
  data: [],
  handleChange: Function,
  fightStatus: boolean,
}

const Dropdown = (props: Props) => {
  const { data, handleChange, fightStatus } = props;
  const { Option } = Select;

  return (
    <Select
      placeholder="Select a pokemon"
      onChange={handleChange}
      disabled={fightStatus}
      className="custome-select"
    >
      {data.map(item => (
        <Option key={item.id} value={item.id}>{item.name}</Option>
      ))}
    </Select>
  );
};

export default Dropdown;
