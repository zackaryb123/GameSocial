import React, { Component } from 'react';
import { connect } from 'react-redux';
import {Header, Message, Modal} from 'semantic-ui-react';

class FeedbackModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: null,
      formSubmit: null,
      formStatus: null
    }
  }

  closeResetModal(){
    this.props.closeModal();
  }

  render() {
    const { feedbackModal } = this.props;

    return (
      <Modal open={this.props.openModal} closeIcon='close' onClose={this.closeResetModal.bind(this)} basic size='small'>
        <Modal.Content>
          <Header inverted icon='thumbs up outline'/>
          {feedbackModal.message && feedbackModal.status === 0 && <Message positive><Message.Header>{feedbackModal.header}</Message.Header><p>{feedbackModal.message}</p></Message>}
          {feedbackModal.message && feedbackModal.status === 1 && <Message negative><Message.Header>{feedbackModal.header}</Message.Header><p>{feedbackModal.message}</p></Message>}
        </Modal.Content>
      </Modal>
    )
  }
}

function mapStateToProps(state){
  return {auth: state.auth, feedbackModal: state.feedbackModal };
}

export default connect(mapStateToProps,
  {})(FeedbackModal);