import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
  closeLoginModal, closeResetPasswordModal, closeForgotPasswordModal,
  openLoginModal, openResetPasswordModal, openForgotPasswordModal,
  openUploadModal, closeUploadModal, openFeedbackModal, closeFeedbackModal,
  openLinksModal, closeLinksModal, closeOneDriveModal, openOneDriveModal
} from '../actions/actions.modals';
import { initApp } from '../actions/init';

import LoginModal from "../components/modal/modal.login";
import ForgotPasswordModal from '../components/modal/modal.password.forgot';
import ResetPasswordModal from '../components/modal/modal.password.reset';
import UploadModal from '../components/modal/modal.upload';
import FeedbackModal from "../components/modal/modal.feedback";
import LinksModal from '../components/modal/modal.links';
import OneDriveModal from '../components/modal/modal.onedrive.upload';

class ContainerShell extends Component{
  constructor(props) {
    super(props);
    this.state = {
      name: 'Shell Container',
      display: 'none'
    }
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    this.props.initApp();
  }
  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);

    // Display app when logged in
    if(nextProps.auth.currentUser){this.setState({display: 'block'})}

    // Hide app when signed out
    if(!nextProps.auth.currentUser){this.setState({display: 'none'})}
  }

  ///////// Open //////////


  openLoginModal(e){
    this.props.openLoginModal();
  }

  openForgotPassModal(e){
    this.props.openForgotPasswordModal();
  }

  openResetPasswordModal(e){
    this.props.openResetPasswordModal();
  }

  openUploadModal(e){
    this.props.openUploadModal()
  }

  openFeedbackModal(e){
    this.props.openFeedbackModal();
  }

  openLinksModal(e){
    this.props.openLinksModal();
  }

  openOneDriveModal(e){
    this.props.openOneDriveModal();
  }

  ///////// Close //////////

  closeLoginModal(e){
    this.props.closeLoginModal();
  }

  closeResetPasswordModal(e){
    this.props.closeResetPasswordModal();
  }

  closeForgotPasswordModal(e){
    this.props.closeForgotPasswordModal();
  }

  closeUploadModal(e){
    this.props.closeUploadModal();
  }

  closeFeedbackModal(e){
    this.props.closeFeedbackModal();
  }

  closeLinksModal(e){
    this.props.closeLinksModal();
  }

  closeOneDriveModal(e){
    this.props.closeOneDriveModal();
  }

  render() {
    // console.log('Shell render');
    const {children, resetPasswordModal, forgotPasswordModal, loginModal, uploadModal, feedbackModal, linksModal, oneDriveModal} = this.props;
    const {display} = this.state;

    return (
      <div className="shell" style={{display: display}}>
        {children}
        {loginModal.openModal &&
          <LoginModal autoOptions={loginModal} openModal={loginModal.openModal} closeModal={this.closeLoginModal.bind(this)} openForgotPassModal={this.openForgotPassModal.bind(this)} /> }
        {uploadModal.openModal &&
          <UploadModal autoOptions={uploadModal} openModal={uploadModal.openModal} closeModal={this.closeUploadModal.bind(this)} /> }
        {resetPasswordModal.openModal &&
          <ResetPasswordModal autoOptions={resetPasswordModal} openModal={resetPasswordModal.openModal} closeModal={this.closeResetPasswordModal.bind(this)} openLogin={this.openLoginModal.bind(this)} />}
        {forgotPasswordModal.openModal &&
          <ForgotPasswordModal autoOptions={forgotPasswordModal} openModal={forgotPasswordModal.openModal} closeModal={this.closeForgotPasswordModal.bind(this)} openLogin={this.openLoginModal.bind(this)} closeLogin={this.closeLoginModal.bind(this)} />}
        {feedbackModal.openModal &&
          <FeedbackModal autoOptions={feedbackModal} openModal={feedbackModal.openModal} closeModal={this.closeFeedbackModal.bind(this)}/>}
        {linksModal.openModal &&
          <LinksModal autoOptions={linksModal} openModal={linksModal.openModal} closeModal={this.closeFeedbackModal.bind(this)}/>}
        {oneDriveModal.openModal &&
          <OneDriveModal autoOptions={oneDriveModal} openModal={oneDriveModal.openModal} closeModal={this.closeOneDriveModal.bind(this)}/>}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  loginModal: state.loginModal,
  uploadModal: state.uploadModal,
  resetPasswordModal: state.resetPasswordModal,
  forgotPasswordModal: state.forgotPasswordModal,
  feedbackModal: state.feedbackModal,
  linksModal: state.linksModal,
  oneDriveModal: state.oneDriveModal
});

export default connect(mapStateToProps,
  {initApp, openLoginModal, closeLoginModal, closeResetPasswordModal,
    closeForgotPasswordModal, openForgotPasswordModal, openResetPasswordModal,
  openUploadModal, closeUploadModal, closeFeedbackModal, openFeedbackModal, openLinksModal, closeLinksModal,
  openOneDriveModal, closeOneDriveModal}
)(ContainerShell);