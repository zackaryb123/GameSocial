import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Image, Card, Button, Dropdown} from 'semantic-ui-react';

import {getPlaylistOnce, addToPlaylist, removeFromPlaylist} from "../../actions/actions.playlist";

//TODO: pass uploadId from this parent
class PlaylistToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  removePlaylist(value) {
    console.log(value);
    const {auth, upload} = this.props;
    this.props.removeFromPlaylist(auth.currentUser.uid, upload.id, value);

    this.props.getPlaylistOnce(auth.currentUser.uid);
  };

  addPlaylist(value) {
    console.log(value);
    const {auth, view} = this.props;
    this.props.addToPlaylist(auth.currentUser.uid, view.data, value);

    this.props.getPlaylistOnce(auth.currentUser.uid);
  };

  renderPlaylistItems() {
    const {playlist, auth, upload} = this.props;
    return _.map(playlist.data, listee => {
      return (
        <div key={listee.name}>
          {
            !_.isEmpty(auth.currentUser) && listee[upload.id] ? (
              <Dropdown.Item
                onClick={() => this.removePlaylist(listee.name)}
                icon='minus' text={listee.name} />
            ) : (
              <Dropdown.Item
                onClick={() => this.addPlaylist(listee.name)}
                icon='plus' text={`${listee.name}`} />
            )
        }
        </div>
      )
    })
  };

  renderPlaylistDropdown(){
    const {playlist} = this.props;
    if(_.isEmpty(playlist.data)){
      return (
        <Dropdown item text='Playlist'>
          <Dropdown.Menu>
            <Dropdown.Item text={'No Playlist'}/>
          </Dropdown.Menu>
        </Dropdown>
      );
    }
    return (
      <Dropdown item text='Playlist'>
        <Dropdown.Menu>
          {this.renderPlaylistItems()}
        </Dropdown.Menu>
      </Dropdown>
    )
  };

  render() {
    const {auth, playlist} = this.props;
    return (
      <div>
        {
          // If followers is updating return loading button
          playlist.loading ? (
            <Button loading/>
          ):(
            <div>
              {
                // if unAuthorized (not logged in) don't show follow or unfollow button
                !_.isEmpty(auth.currentUser) &&
                  <div>
                    {this.renderPlaylistDropdown()}
                  </div>
              }
            </div>
          )
        }
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  playlist: state.playlist,
  view: state.view
});

export default connect(mapStateToProps,
  {getPlaylistOnce, removeFromPlaylist, addToPlaylist})
(PlaylistToggle);