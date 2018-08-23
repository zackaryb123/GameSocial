import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Card, Image, Segment, Feed } from "semantic-ui-react";

import VideoPlayer from '../video/video.player';
import {getUserPlaylistOnce} from '../../actions/actions.user.get';
import { removeFromPlaylist } from "../../actions/actions.user.delete";

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
    const { auth, upload, activePlaylist, start, page, count } = this.props;
    this.props.removeFromPlaylist(auth.currentUser.uid, upload.id, activePlaylist);
    this.props.getUserPlaylistOnce(auth.currentUser.uid, start, page, count, activePlaylist);
  };

  render() {
    const { auth, user, upload } = this.props;
    return (
      <Card fluid>
        <Feed style={{margin: '0', background: '#1B1C1D'}}>
          <Feed.Event>
            <Feed.Content>
              <Feed.Meta style={{margin: '0', float: 'right'}}>
                <Feed.Like>
                  {auth.currentUser.uid === user.data.id &&
                  <Icon inverted size='large' style={cssCloseIcon} corner onClick={this.removePlaylist} name={"remove circle"}/>}
                </Feed.Like>
              </Feed.Meta>
            </Feed.Content>
          </Feed.Event>
        </Feed>
        <VideoPlayer source={upload} options={upload.options}/>
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
  {removeFromPlaylist, getUserPlaylistOnce}
)(PlaylistCard);

const cssCloseIcon = {
  // position: 'absolute',
  top: '0',
  right: '0',
  backgroundColor: '#1B1C1D',
  cursor: 'pointer',
  margin: '0'
};
