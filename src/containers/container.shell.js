import React, {Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';

import { closeLoginModal, closeResetPasswordModal, closeForgotPasswordModal,
  openLoginModal, openResetPasswordModal, openForgotPasswordModal } from '../actions/actions.modals';
import { initApp } from '../actions/init';

import LoginModal from "../components/modals/modal.login";
import ForgotPasswordModal from '../components/modals/modal.password.forgot';
import ResetPasswordModal from '../components/modals/modal.password.reset';

class ContainerShell extends Component{
  constructor(props) {
    super(props);
    this.state = {
     name: 'Shell'
    }
  }


  componentWillMount() {
    //Constructor equivalent (state updates)
    console.log(this.state.name, "Will Mount");
  }

  componentDidMount(){
    console.log(this.state.name,"Did Mount");

    this.props.initApp();
    console.log('App Initialized');
  }
  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState)
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    console.log(this.state.name, "Will Unmount");
  }


  openLoginModal(e){
    this.props.openLoginModal();
  }

  openForgotPassModal(e){
    this.props.openForgotPasswordModal();
  }

  openResetPasswordModal(e){
    this.props.openResetPasswordModal();
  }

  closeLoginModal(e){
    this.props.closeLoginModal(0);
  }

  closeResetPasswordModal(e){
    this.props.closeResetPasswordModal();
  }

  closeForgotPasswordModal(e){
    this.props.closeForgotPasswordModal();
  }


  render() {
    const {children, resetPasswordModal, forgotPasswordModal, loginModal } = this.props;
    return (
      <div className="shell">
        {children}
        {loginModal.openModal &&
          <LoginModal autoOptions={loginModal} openModal={loginModal.openModal} closeModal={this.closeLoginModal.bind(this)} openForgotPassModal={this.openForgotPassModal.bind(this)} /> }
        {resetPasswordModal.openModal &&
          <ResetPasswordModal autoOptions={resetPasswordModal} openModal={resetPasswordModal.openModal} closeModal={this.closeResetPasswordModal.bind(this)} openLogin={this.openLoginModal.bind(this)} />}
        {forgotPasswordModal.openModal &&
          <ForgotPasswordModal autoOptions={forgotPasswordModal} openModal={forgotPasswordModal.openModal} closeModal={this.closeForgotPasswordModal.bind(this)} openLogin={this.openLoginModal.bind(this)} closeLogin={this.closeLoginModal.bind(this)} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loginModal: state.loginModal,
  resetPasswordModal: state.resetPasswordModal,
  forgotPasswordModal: state.forgotPasswordModal
});

export default connect(mapStateToProps,
  {initApp, openLoginModal, closeLoginModal, closeResetPasswordModal,
    closeForgotPasswordModal, openForgotPasswordModal, openResetPasswordModal }
)(ContainerShell);