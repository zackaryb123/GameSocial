import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import {Message, Header, Input, Modal, Form, Button, Icon, Label} from 'semantic-ui-react';
import { forgotPasswordValidate } from '../form/form.validation';
import {openLoginModal, sendResetPassEmail} from "../../actions/actions.modals";
// import _ from 'lodash';

class ForgotPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: null,
      formSubmit: null,
      formStatus: null
    }
  }

  sendResetPasswordEmail(values){
    console.log('Send Email submit function hit')
    this.props.dispatch(reset('forgotPassword'));
    this.props.sendResetPassEmail(values.email);
  }

  closeResetModal(){
    this.props.dispatch(reset('forgotPassword'));
    this.props.closeModal();
    this.props.openLoginModal();
  }

  renderFields(field){
    return(
      <Form.Field required>
        <Input {...field.input} {...field.error }  fluid={field.fluid} type={field.type} placeholder={field.placeholder} />
        {field.meta.touched && (field.meta.error && <Label pointing color='red'> {field.meta.error} </Label>)}
      </Form.Field>
    )
  }

  render() {
    const { handleSubmit, forgotPasswordModal } = this.props;

    return (
      <Modal open={this.props.openModal} closeIcon='close' onClose={this.closeResetModal.bind(this)} closeOnDocumentClick={true} closeOnDimmerClick={false} basic size='small'>

        <Header icon='lock' content='Forgot Password'/>

        <Modal.Content>
          {forgotPasswordModal.message && forgotPasswordModal.status === 0 && <Message positive><Message.Header>{forgotPasswordModal.header}</Message.Header><p>{forgotPasswordModal.message}</p></Message>}
          {forgotPasswordModal.message && forgotPasswordModal.status === 1 && <Message negative><Message.Header>{forgotPasswordModal.header}</Message.Header><p>{forgotPasswordModal.message}</p></Message>}
          <Form inverted={true} onSubmit={handleSubmit(this.sendResetPasswordEmail.bind(this))}>
            <Field fluid name="email" type="text" placeholder="Enter Email" component={this.renderFields} />
            <Button type='submit' basic color='green' inverted><Icon name='checkmark'/>Send Reset Email</Button>
          </Form>
        </Modal.Content>

      </Modal>
    )
  }
}

const ForgotPasswordForm = reduxForm({
  // validate: profileValidate,
  form: 'forgotPassword',
  validate: forgotPasswordValidate
})(
  connect(mapStateToProps,{openLoginModal, sendResetPassEmail})(ForgotPasswordModal)
);

function mapStateToProps(state){
  return {auth: state.auth, forgotPasswordModal: state.forgotPasswordModal };
}

export default ForgotPasswordForm;