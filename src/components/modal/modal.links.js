import React, { Component } from "react";
import * as firebase from 'firebase';
import { Segment, Header, Modal, Dropdown, Form, Button } from "semantic-ui-react";
import {connect} from 'react-redux';
import moment from 'moment';
import {closeLinksModal} from '../../actions/actions.modals';
import { linkFacebookDVR, updateFacebookDVR} from '../../actions/actions.user.links';
import { UserAgentApplication } from "msal";
const MicrosoftConfig = require('MicrosoftConfig');
import axios from 'axios';

class LinksModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null
    }
  }

  linkXboxDVR = () => {
    var userAgentApplication = new UserAgentApplication(MicrosoftConfig.clientId, null, null,{
      redirectUri: MicrosoftConfig.linkOneDriveRedirect
    });
    localStorage.setItem('linkDvr', true);
    userAgentApplication.loginRedirect(MicrosoftConfig.scope);
  };

  updateXboxDVR = () => {
    var userAgentApplication = new UserAgentApplication(MicrosoftConfig.clientId, null, null,{
      redirectUri: MicrosoftConfig.browseOneDriveRedirect
    });
    localStorage.setItem('updateDvr', true);
    userAgentApplication.loginRedirect(MicrosoftConfig.scope)
  };

  linkFacebookDVR() {
    // this.props.auth.currentUser.unlink('facebook.com');
    this.props.linkFacebookDVR(this.props.auth);
  };

  updateFacebookDVR(){
    let thisComp = this;
    this.props.auth.currentUser.unlink('facebook.com')
      .then(() => {
        firebase.database().ref(`users/${this.props.auth.currentUser.uid}/facebook/email`).once('value', snap => {
          let email = snap.val();
          thisComp.props.updateFacebookDVR(thisComp.props.auth, email)
        });
      });
  };

  closeResetModal(){
    this.props.closeLinksModal();
  }

  render() {
    const {auth} = this.props;
    return (
      <Modal
        closeIcon='close' onClose={this.closeResetModal.bind(this)}
        open={this.props.openModal}
        basic
        size="small"
      >
        <Header icon='lock' content='Account Link'/>
        <Modal.Content>
          <Modal.Description>
            <Segment textAlign='center'>
              {_.isEmpty(auth.xboxFileId) ? <Button onClick={this.linkXboxDVR}>Link Xbox DVR</Button> : <Button onClick={this.updateXboxDVR}>Update Xbox DVR</Button>}
              {/*{_.isEmpty(auth.facebook) ? <Button onClick={this.linkFacebookDVR.bind(this)}>Link Playstation DVR</Button> : <Button onClick={this.updateFacebookDVR.bind(this)}>Update Playstation DVR</Button>}*/}
            </Segment>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{closeLinksModal, linkFacebookDVR, updateFacebookDVR})(LinksModal);
