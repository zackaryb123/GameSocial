import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import _ from "lodash";

import { Grid } from "semantic-ui-react";

import PlaylistCard from "../card/card.playlist";
import PlaylistMenu from "../menu/menu.playlist";

import {getPlaylistOptions} from '../../actions/actions.playlist';

export class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlaylist: null
    };
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    const {auth, getPlaylistOptions} = this.props;

    getPlaylistOptions(auth.currentUser.uid).then(playlistList => {
      this.setState({ playlistList: playlistList})
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

  renderUserPlaylist(playlist) {
    return _.map(playlist, upload => {
      if (upload === playlist.name) {
        return null;
      }
      return (
        <Grid.Column mobile={16} computer={8} largeScreen={5} style={{ marginBottom: "1rem" }} key={upload.id}>
          <PlaylistCard activePlaylist={this.state.activePlaylist} upload={upload} />
        </Grid.Column>
      );
    });
  }

  getActivePlaylist(state) {
    this.setState({
      activePlaylist: state
    });
  }

  render() {
    const { activePlaylist, playlistList } = this.state;
    return (
      <div>
         <PlaylistMenu getActivePlaylist={state => this.getActivePlaylist(state)} />
        {
          !_.isEmpty(playlistList) && playlistList[activePlaylist] && activePlaylist === playlistList[activePlaylist].name && (
          <Grid stackable>
            <Grid.Row>
              {this.renderUserPlaylist(playlistList[activePlaylist])}
              </Grid.Row>
          </Grid>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  playlist: state.playlist
});

export default connect(
  mapStateToProps,
  {getPlaylistOptions}
)(ProfileDetail);
