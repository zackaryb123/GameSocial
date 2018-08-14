import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import _ from 'lodash';

import {Image, Card, Button, Dropdown} from 'semantic-ui-react';

import {getPlaylistOnce, addToPlaylist, removeFromPlaylist, getPlaylistOptions} from "../../actions/actions.playlist";

class PlaylistToggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlistList: null
    }
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    this.mounted = true;
    const {auth, getPlaylistOptions} = this.props;
    getPlaylistOptions(auth.currentUser.uid)
      .then(playlistList => {
        console.log(playlistList);
        if(this.mounted) {
          this.setState({ playlistList: playlistList})}
      });
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {playlist} = this.props;
    if (nextProps.playlist.data !== playlist.data){
      this.setState({ playlistList: nextProps.playlist.data})
    } else {
      console.log('Component Up to date!')}
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  removePlaylist(playlistName) {
    const {auth, upload} = this.props;
    this.props.removeFromPlaylist(auth.currentUser.uid, upload.id, playlistName);
    this.props.getPlaylistOnce(auth.currentUser.uid);
  };

  addPlaylist(playlistName) {
    const {auth, upload} = this.props;
    this.props.addToPlaylist(auth.currentUser.uid, upload, playlistName);
    this.props.getPlaylistOnce(auth.currentUser.uid);
  };

  renderPlaylistItems() {
    const {upload} = this.props;
    const {playlistList} = this.state;

    return _.map(playlistList, playlist => {
      return (
        <div key={playlist.name}>
          {console.log(playlistList[playlist.name][upload.id])}
          {
            playlistList[playlist.name][upload.id] ? (
              <Dropdown.Item style={cssPlaylist}
                onClick={() => this.removePlaylist(playlist.name)}
                icon='minus' text={playlist.name} />
            ) : (
              <Dropdown.Item style={cssPlaylist}
                onClick={() => this.addPlaylist(playlist.name)}
                icon='plus' text={playlist.name} />
            )
        }
        </div>
      )
    })
  };

  renderPlaylistDropdown(){
    const {playlistList} = this.state;
    if(_.isEmpty(playlistList)){
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
    return (
      <div>
        {this.renderPlaylistDropdown()}
      </div>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  playlist: state.playlist
});

export default connect(mapStateToProps,
  {getPlaylistOnce, removeFromPlaylist, addToPlaylist, getPlaylistOptions})
(PlaylistToggle);

const cssPlaylist = {
  color: 'black',
  cursor: 'pointer'
};