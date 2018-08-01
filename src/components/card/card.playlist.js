import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Player} from 'video-react';

import {Icon, Card, Image, Segment} from 'semantic-ui-react';

//import FormEditUserUpload from '../Form/Form.EditUserUpload';
import {removeFromPlaylist, getPlaylistOnce} from '../../actions/actions.playlist';

class PlaylistCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false
    }
  }

  removePlaylist(){
    const {auth, video, playlist} = this.props;

    console.log(auth.currentUser.uid, video.id, playlist);
    this.props.removeFromPlaylist(auth.currentUser.uid, video.id, playlist);
    this.props.getPlaylistOnce(auth.currentUser.uid);
  };

  render() {
    const {auth, user, video} = this.props;
    return (
        <Card fluid>
          <Player
            className="card-img-top"
            alt="upload" aspectRatio='16:9'
            controls={false} playsInline={true}
            muted={true} autoPlay={false} loop={false}>
            <source src={video.url}/>
          </Player>
          {
            auth.currentUser &&(auth.currentUser.uid === user.data.id) &&
            <Card.Content textAlign={'right'}>
              <Icon onClick={() => this.removePlaylist()} name={'remove circle'}/>
            </Card.Content>
          }
        </Card>
    );
  };
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(mapStateToProps,
  {removeFromPlaylist, getPlaylistOnce})(PlaylistCard);