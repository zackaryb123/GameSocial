import React, { Component } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { Grid, Icon, Menu, Segment, Container } from "semantic-ui-react";

import PlaylistCard from "../card/card.playlist";
import PlaylistMenu from "../menu/menu.playlist";

import {getPlaylistOptions} from '../../actions/actions.playlist';
import {getUserPlaylistOnce, getNextUserPlaylistOnce, getPrevUserPlaylistOnce} from "../../actions/actions.user.get";

export class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlaylist: null
    };
  }

  componentWillMount() {
    this.setState({count: 10, start: 0, page: 1})
  }

  componentDidMount() {
    const {auth, getPlaylistOptions} = this.props;

    getPlaylistOptions(auth.currentUser.uid).then(playlistList => {
      this.setState({ playlistList: playlistList})
    });
  }

  retrievePrev() {
    const { count, page, start, activePlaylist} = this.state;
    const {user} = this.props;
    const newStart = start - count;
    console.log(newStart);
    if(start > 0){
      this.props.getPrevUserPlaylistOnce(user.data.id, newStart, page, count, activePlaylist).then(data => {
        this.setState({ start: newStart , page: data.page, total: data.total })
      });
    }
  }

  retrieveNext() {
    const { count, total, page, start, activePlaylist } = this.state;
    const {user} = this.props;
    const newStart = start + count;
    console.log(newStart);
    if(start + count < total) {
      this.props.getNextUserPlaylistOnce(user.data.id, newStart, page, count, activePlaylist).then(data => {
        this.setState({ start: newStart, page: data.page, total: data.total })
      })
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
    this.setState({ activePlaylist: state });
    const {user} = this.props;
    const {start} = this.state;
    const page = 1;
    const count = 10;

    this.props.getUserPlaylistOnce( user.data.id, start, page, count, state).then(data =>{
      if(this.mounted){
        this.setState({
          start: count * data.page - count,
          total: data.total })
      }
    });
  }

  render() {
    const { activePlaylist, playlistList } = this.state;
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
                      {this.state.start} - {this.state.start+this.state.count} of {this.state.total}
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
                      {this.state.start} - {this.state.start+this.state.count} of {this.state.total}
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
  {getPlaylistOptions, getUserPlaylistOnce, getNextUserPlaylistOnce, getPrevUserPlaylistOnce}
)(ProfileDetail);
