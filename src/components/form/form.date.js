import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Dropdown, Select, Form, Label, Icon } from 'semantic-ui-react';

export function SelectDay(props){

  console.log('Select Sport');

  const day = [];

  for (var i=1; i<32 ; i++ ){
    let  num = (i < 10)?'0'+i:i;
    day.push({
      key: i,
      value: num,
      text: num
    })
  }

  return(
    <Form.Field>
      <Select
        fluid
        placeholder='01'
        value={props.input.value}
        onChange={(param,data) => props.input.onChange(data.value)}
        options={day}
      />

      {props.meta.touched && (props.meta.error && <Label pointing> {props.meta.error} </Label>)}
    </Form.Field>
  )
}

export function SelectMonth(props){

  console.log('Select Sport');
  const months = [];

  for (var i=1; i<13 ; i++ ){
    months.push({
      key: (i < 10)?'0'+i:i,
      value: (i < 10)?'0'+i:i,
      text: (i < 10)?'0'+i:i
    })
  }

  return(
    <Form.Field>
      <Select
        fluid
        placeholder='01'
        value={props.input.value}
        onChange={(param,data) => props.input.onChange(data.value)}
        options={months}
      />

      {props.meta.touched && (props.meta.error && <Label pointing> {props.meta.error} </Label>)}
    </Form.Field>
  )
}
