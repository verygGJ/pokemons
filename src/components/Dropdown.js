import React from 'react';
import { Select } from 'antd';
import 'antd/dist/antd.css';


const Dropdown = ({ data, handleChange }) => {
  const { Option } = Select;
  return (
    <Select 
      placeholder="Select a pokemon"
      onChange={handleChange}
      style={{ width: 200 }}
    >
      {data.map((item) => {
        return (
          <Option key={item.id} value={item.id}>{item.name}</Option>
        );
      })}
    </Select>
  )
}

export default Dropdown;