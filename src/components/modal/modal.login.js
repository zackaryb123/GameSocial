import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import { Field, reduxForm, reset } from 'redux-form';
import {Message, Header, Modal, Form, Input, Label, Button, Icon, Menu} from 'semantic-ui-react';
import  validate  from '../form/form.validation';
import {loginMlab, loginFirebase, registerMlab, registerFirebase} from '../../actions/actions.auth'
import {closeLoginModal, openLoginModal, openForgotPasswordModal} from "../../actions/actions.modals";
// import _ from 'lodash';

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: 'Login',
      msg: null,
      code: null,
      formSubmit: null,
      formStatus: null
    }
  }

  loginSubmit(values){
    this.props.loginFirebase(values.email, values.password)
  }

  registerSubmit(values) {
    this.props.registerFirebase(values);
  }

  closeResetModal(){
    this.props.dispatch(reset('loginPassword'));
    this.props.closeModal();
  }

  handleItemClick = (e, { name }) => {
    this.props.openLoginModal();
    this.setState({activeItem: name});
  };

  handleModalSwitch(){
    this.props.closeLoginModal();
    this.props.openForgotPasswordModal();
  }

  renderMenu(activeItem) {
    return (
      <Menu style={{borderBottom: 'solid 1px'}} inverted secondary tabular>
        <Menu.Item name='Login' active={activeItem === 'Login'} onClick={this.handleItemClick} />
        <Menu.Item name='Register' active={activeItem === 'Register'} onClick={this.handleItemClick} />
      </Menu>
    );
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
    const {activeItem} = this.state;
    const { handleSubmit, loginModal } = this.props;

    return (
      <Modal open={this.props.openModal} closeOnDocumentClick={false} closeOnDimmerClick={false} basic size='small'>

        {this.renderMenu(activeItem)}

        <Header icon='lock' content={activeItem}/>

        {activeItem === 'Login' &&
        <Modal.Content>
          {loginModal.message && loginModal.status === 0 && <Message positive><Message.Header>{loginModal.header}</Message.Header><p>{loginModal.message}</p></Message>}
          {loginModal.message && loginModal.status === 1 && <Message negative><Message.Header>{loginModal.header}</Message.Header><p>{loginModal.message}</p></Message>}
          <Form inverted={true} onSubmit={handleSubmit(this.loginSubmit.bind(this))}>
            <Field fluid name="email" type="text" placeholder="Enter Email" component={this.renderFields}/>
            <Field fluid name="password" type="password" placeholder="Enter Password" component={this.renderFields}/>
            <Button type='submit' basic color='green' inverted><Icon name='checkmark'/>Login</Button>
            <div>
              <Header as='h4' style={{textAlign: 'right', marginTop: '.5rem'}}>
                <a style={{ cursor: 'pointer' }} onClick={this.handleModalSwitch.bind(this)}>{'Forgot Password'}</a>
              </Header>
            </div>
          </Form>
        </Modal.Content>}

        {activeItem === 'Register' &&
        <Modal.Content>
          {loginModal.message && loginModal.status === 0 && <Message positive><Message.Header>{loginModal.header}</Message.Header><p>{loginModal.message}</p></Message>}
          {loginModal.message && loginModal.status === 1 && <Message negative><Message.Header>{loginModal.header}</Message.Header><p>{loginModal.message}</p></Message>}
          <Form inverted={true} onSubmit={handleSubmit(this.registerSubmit.bind(this))}>
            <Field fluid name="username" type="text" placeholder="Enter Username" component={this.renderFields}/>
            <Field fluid name="firstName" type="text" placeholder="Enter First Name" component={this.renderFields}/>
            <Field fluid name="lastName" type="text" placeholder="Enter LastName" component={this.renderFields}/>
            <Field fluid name="email" type="text" placeholder="Enter Email" component={this.renderFields}/>
            <Field fluid name="password" type="password" placeholder="Enter Password" component={this.renderFields}/>
            <Button type='submit' basic color='green' inverted><Icon name='checkmark'/>Register</Button>
          </Form>
        </Modal.Content>}

      </Modal>
    );
  }
}

const LoginForm = reduxForm({
  form: 'loginPassword',
  validate: validate
})(
  connect(mapStateToProps,
    {loginMlab, loginFirebase, registerMlab, registerFirebase,
      closeLoginModal, openLoginModal, openForgotPasswordModal})
  (LoginModal)
);

function mapStateToProps(state){
  return {auth: state.auth, loginModal: state.loginModal};
}

export default LoginForm;