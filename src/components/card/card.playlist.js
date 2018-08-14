import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Player } from "video-react";
import { Icon, Card, Image, Segment } from "semantic-ui-react";

import VideoPlayer from '../video/video.player';
import {
  removeFromPlaylist,
  getPlaylistOnce
} from "../../actions/actions.playlist";

class PlaylistCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  hoverCard = (e) => this.setState({hoverCard: true});
  unhoverCard = (e) => this.setState({hoverCard: false});

  removePlaylist = () => {
    const { auth, user, upload, activePlaylist } = this.props;
    this.props.removeFromPlaylist(auth.currentUser.uid, upload.id, activePlaylist);
    this.props.getPlaylistOnce(user.data.id);
  };

  render() {
    const { auth, user, upload } = this.props;
    return (
      <Card fluid>
        <VideoPlayer source={upload} options={upload.options}/>
        {auth.currentUser.uid === user.data.id &&
        <Icon size='big' style={cssCloseIcon} corner onClick={this.removePlaylist} name={"remove circle"}/>}
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(
  mapStateToProps,
  {removeFromPlaylist, getPlaylistOnce}
)(PlaylistCard);

const cssCloseIcon = {
  position: 'absolute',
  top: '0',
  right: '0',
  backgroundColor: 'white',
  cursor: 'pointer',
  margin: '0'
};
