import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Input, Form, Label } from 'semantic-ui-react';

function textareaField(field){
  return(
    <Form.Field>
      <textarea {...name} label={field.label} placeholder={field.placeholder} icon={field.icon} defaultValue={field.setValue} {...field.error && error } />
      {field.meta.touched && (field.meta.error && <Label pointing basic color='red'> {field.meta.error} </Label>)}
    </Form.Field>
  )
}

export default textareaField;