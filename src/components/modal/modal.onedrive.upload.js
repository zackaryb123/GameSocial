import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Icon, Header, Input, Message, Modal } from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import _ from "lodash";

class OneDriveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      msg: null,
      formSubmit: null,
      formStatus: null
    };
  }

  closeResetModal() {
    this.props.closeModal();
  }

  downloadUrl(webUrl) {

  }

  renderOneDriveRadioOptions = list => {
    console.log(list);
    return _.map(list, item =>
      <Table.Row key={item.id}>
        <Table.Cell><a target='_blank' href={item.webUrl}>{item.name}</a></Table.Cell>
        <Table.Cell>{item.createdDateTime}</Table.Cell>
        <Table.Cell><a href={item.downloadUrl}><Icon name='download'/></a></Table.Cell>
      </Table.Row>
    )
  };

  render() {
    const { oneDriveModal, auth } = this.props;

    return (
      <Modal
        open={this.props.openModal}
        closeIcon="close"
        onClose={this.closeResetModal.bind(this)}
        basic
        size="small"
      >
        <Modal.Content>
          <Header inverted icon="selected radio" content='Xbox Game DVR'/>
          {oneDriveModal.message &&
            oneDriveModal.status === 0 && (
              <Message positive>
                <Message.Header>{oneDriveModal.header}</Message.Header>
                <p>{oneDriveModal.message}</p>
              </Message>
            )}
          {oneDriveModal.message &&
            oneDriveModal.status === 1 && (
              <Message negative>
                <Message.Header>{oneDriveModal.header}</Message.Header>
                <p>{oneDriveModal.message}</p>
              </Message>
            )}
          <Table selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Date Created</Table.HeaderCell>
                <Table.HeaderCell>Download</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {!_.isEmpty(auth.xboxVideos) &&
              this.renderOneDriveRadioOptions(oneDriveModal.videos)}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth,
    user: state.user,
    oneDriveModal: state.oneDriveModal
  };
}

export default connect(mapStateToProps,{})(OneDriveModal);
