import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Grid, Icon, Menu, Segment, Container } from "semantic-ui-react";

import PlaylistCard from "../card/card.playlist";
import PlaylistMenu from "../menu/menu.playlist";

import {getPlaylistOptions} from '../../actions/actions.playlist';
import {getUserPlaylist, getNextUserPlaylist, getPrevUserPlaylist} from "../../actions/actions.uploads";
import {getPlaylistTotal} from "../../actions/actions.user.services";

var moment = require("moment");
moment().format();

export class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlaylist: null,
      page: 1
    };
  }

  componentDidMount() {
    const {auth, getPlaylistOptions} = this.props;

    getPlaylistOptions(auth.currentUser.uid).then(playlistList => {
      this.setState({ playlistList: playlistList})
    });
  }

  retrievePrev() {
    const { count, page, start, activePlaylist} = this.state;
    const {user,uploads} = this.props;
    const date =  uploads.data[0].created_at;
    console.log(date);
    if(start > 0){
      this.props.getPlaylistTotal(auth.currentUser.uid, state);
      this.props.getPrevUserPlaylist(user.data.id, date, page, activePlaylist)
    }
  }

  retrieveNext() {
    const { count, total, page, start, activePlaylist } = this.state;
    const {user, uploads} = this.props;
    const date = uploads.data[9].created_at;
    console.log(date);
    if(start + count < total) {
      this.props.getPlaylistTotal(auth.currentUser.uid, state);
      this.props.getNextUserPlaylist(user.data.id, date, page, activePlaylist)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {playlist} = this.props;
    if (nextProps.playlist.data !== playlist.data){
      this.setState({ playlistList: nextProps.playlist.data})
    } else {
      console.log('Component Up to date!')}
  }

  componentDidUpdate(){
  this.mounted = true
  }


  renderUserPlaylist(playlist) {
    const {activePlaylist, page, count, start } = this.state;
    return _.map(playlist, upload => {
      if (upload === playlist.name) {
        return null;
      }
      return (
        <Grid.Column mobile={16} computer={8} largeScreen={5} style={{ marginBottom: "1rem" }} key={upload.id}>
          <PlaylistCard
            start={start}
            page={page}
            count={count}
            activePlaylist={activePlaylist}
            upload={upload} />
        </Grid.Column>
      );
    });
  }

  getActivePlaylist(state) {
    const {user, auth} = this.props;
    this.setState({ activePlaylist: state, page: 1 });
    this.props.getPlaylistTotal(auth.currentUser.uid, state);
    this.props.getUserPlaylist( user.data.id, moment(Date.now()).format(), 1, state)
  }

  render() {
    const { activePlaylist, playlistList, page } = this.state;
    const {uploads} = this.props;
    return (
      <div>
        <PlaylistMenu getActivePlaylist={state => this.getActivePlaylist(state)} />
          {
            !_.isEmpty(playlistList) && playlistList[activePlaylist] && activePlaylist === playlistList[activePlaylist].name && (
            <Grid stackable>
              {activePlaylist && playlistList &&
                <Container fluid style={{marginTop: '1rem'}}>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon
                               onClick={() => this.retrievePrev()}>
                      <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item>
                      {page*10-10} - {uploads.count<10 ? uploads.count-1 : page*10} of {uploads.count-1}
                    </Menu.Item>
                    <Menu.Item as='a' icon
                               onClick={() => this.retrieveNext()}>
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Container>}
              <Grid.Row>
                {this.renderUserPlaylist(uploads.data)}
              </Grid.Row>
              {activePlaylist && playlistList &&
                <Container fluid>
                  <Menu floated='right' pagination>
                    <Menu.Item as='a' icon
                               onClick={() => this.retrievePrev()}>
                      <Icon name='chevron left' />
                    </Menu.Item>
                    <Menu.Item>
                      {page*10-10} - {uploads.count<10 ? uploads.count-1 : page*10} of {uploads.count-1}
                    </Menu.Item>
                    <Menu.Item as='a' icon
                               onClick={() => this.retrieveNext()}>
                      <Icon name='chevron right' />
                    </Menu.Item>
                  </Menu>
                </Container>}
            </Grid>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  playlist: state.playlist,
  uploads: state.uploads
});

export default connect(
  mapStateToProps,
  {getPlaylistOptions, getUserPlaylist, getNextUserPlaylist, getPrevUserPlaylist, getPlaylistTotal}
)(ProfileDetail);
