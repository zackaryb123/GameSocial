import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Input, Form, Label } from 'semantic-ui-react';

function inputField(field){
  return(
    <Form.Field>
      <Input {...field.input} fluid={field.fluid} label={field.label} maxLength={field.maxLength} placeholder={field.placeholder} type={field.type} icon={field.icon} iconPosition={field.iconPosition} {...field.error && error } autoFocus={field.autoFocus} />
      {field.meta.touched && (field.meta.error && <Label pointing basic color='red'> {field.meta.error} </Label>)}
    </Form.Field>
  )
}

export default inputField;