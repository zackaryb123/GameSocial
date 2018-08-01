import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import {Icon, Input, Button, Message, Header, Modal, Form, Label} from 'semantic-ui-react';
import { resetPasswordValidate } from '../form/form.validation';
import * as firebase from "firebase";
import {getUrlParameters, handleConfirmPasswordReset} from "../../actions/init";
import {openLoginModal, closeResetPasswordModal} from "../../actions/actions.modals";
// import _ from 'lodash';

class ResetPasswordModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: true,
      msg: null,
      formSubmit: null,
      formStatus: null
    }
  }

  componentWillMount() {
    this.setState({
      openModal: true
    })
  }

  submitConfirmPassReset(values){
    const auth = firebase.auth();

    const actionCode = getUrlParameters('oobCode', "", true);
    const newPassword = values.password1;

    if (!actionCode) {
      openLoginModal('Oops! An error occurred', 'Please try reset password steps again.', 1);
    } else {
      this.props.handleConfirmPasswordReset(actionCode, newPassword);
    }
  }

  closeResetModal(){
    this.props.dispatch(reset('resetPassword'));
    this.props.closeModal();
    this.props.openLoginModal();
  }

  renderFields(field){
    return(
      <Form.Field>
        <Input {...field.input} {...field.error }  fluid={field.fluid} type={field.type} placeholder={field.placeholder} />
        {field.meta.touched && (field.meta.error && <Label pointing color='red'> {field.meta.error} </Label>)}
      </Form.Field>
    )
  }

  render() {
    const { handleSubmit, resetPasswordModal } = this.props;

    return (
      <Modal open={this.props.openModal} closeIcon='close' onClose={this.closeResetModal.bind(this)} closeOnDocumentClick={true} closeOnDimmerClick={false} basic size='small'>
        <Header icon='unlock' content='Reset Password'/>
        <Modal.Content>
          {resetPasswordModal.message && resetPasswordModal.status === 0 && <Message positive><Message.Header>{resetPasswordModal.header}</Message.Header><p>{resetPasswordModal.message}</p></Message>}
          {resetPasswordModal.message && resetPasswordModal.status === 1 && <Message negative><Message.Header>{resetPasswordModal.header}</Message.Header><p>{resetPasswordModal.message}</p></Message>}
          <Form inverted={true} onSubmit={handleSubmit(this.submitConfirmPassReset.bind(this))}>
            <Field fluid name="password1" type="password" placeholder='Enter Password' component={this.renderFields} />
            <Field fluid name="password2" type="password" placeholder='Confirm Password' component={this.renderFields} />
            <Button type='submit' basic color='green' inverted><Icon name='checkmark'/>Reset Password</Button>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

const ResetPasswordForm = reduxForm({
  // validate: profileValidate,
  form: 'resetPassword',
  validate: resetPasswordValidate
})(
  connect(mapStateToProps,{handleConfirmPasswordReset, getUrlParameters, closeResetPasswordModal, openLoginModal})(ResetPasswordModal)
);

function mapStateToProps(state){
  return { resetPasswordModal: state.resetPasswordModal};
}

export default ResetPasswordForm;