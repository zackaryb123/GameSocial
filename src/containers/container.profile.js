import React, {Component} from 'react';
import * as firebase from 'firebase'
import {connect} from 'react-redux';
import _ from 'lodash';
import { Grid, Header, Container, Image, Card, Segment, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";

import {getInitUser, getUserOnce, clearUser} from "../actions/actions.user";
import { getUserUploads, getNextUserUploads,getPrevUserUploads } from "../actions/actions.uploads";
import {getUserUploadsTotal} from '../actions/actions.user.services';
import {linkXboxDVR, updateXboxDVR} from "../actions/actions.user.links";

import FeedCard from '../components/card/card.upload';
import MenuProfile from "../components/menu/menu.profile";
import UserCard from '../components/card/card.user';
import ProfileDetail from '../components/detail/detail.profile';
import PlaylistDetail from '../components/detail/detail.playlist';
import { openOneDriveModal } from "../actions/actions.modals";

var moment = require("moment");
moment().format();

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Profile Container',
      activeMenu: null,
      pageRefresh: null,
      page:1,
      count: 10
    }
  }

  componentDidMount(){
    const {match: {params}, auth, getUserOnce} = this.props;
    this.mount = true;
    console.log(localStorage);
    if(!_.isEmpty(auth.currentUser)) {
      getUserOnce(params.userId);
    }
  }

  retrievePrev() {
    const {page, count, activeMenu} = this.state;
    const {user, uploads} = this.props;
    const date =  uploads.data[0].created_at;
    if(page*count-count > 1){
      this.props.getUserUploadsTotal(user.data.id, activeMenu);
      this.props.getPrevUserUploads(user.data.id, date, page, activeMenu)
    }
  }

  retrieveNext() {
    const { count, page, activeMenu } = this.state;
    const {user, uploads} = this.props;
    const date = uploads.data[uploads.data.length - 1].created_at;

    if(page*count < uploads.count) {
      this.props.getUserUploadsTotal(user.data.id, activeMenu);
      this.props.getNextUserUploads(user.data.id, date, page, activeMenu)
    }
  }

  componentWillReceiveProps(nextProps) {
    const {auth, match: {params}} = this.props;
    //TODO: possibly dispatch to redux instead local storage
    const msalAccessToken = localStorage.getItem('msal.access.token');
    const linkXboxDVR = localStorage.getItem('linkDvr');
    const updateOneDrive = localStorage.getItem('updateDvr');

    //TODO: May need to make refresh account for users instead of auth
    if (!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)) {
      this.setState({ pageRefresh: true });
    } else if (linkXboxDVR === 'true' && msalAccessToken && _.isEmpty(auth.xboxFileId)) {
      this.setState({ linkOneDrive: true });
    } else if (updateOneDrive === 'true' && msalAccessToken && !_.isEmpty(auth.xboxFileId)) {
      this.setState({ updateOneDrive: true });
    } else if (nextProps.match.params.userId !== params.userId) {
      this.setState({ switchUser: true });
    } else {console.log("Props state up to date!");}
  }

  shouldComponentUpdate(nextProps, nextState) {
    switch (true) {
      case _.isEmpty(nextProps.auth.currentUser):
        return false;
      default:
        return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {getUserOnce, linkXboxDVR, updateXboxDVR, match: {params}, auth } = this.props;
    const { pageRefresh, switchUser, linkOneDrive, updateOneDrive } = this.state;
    this.mounted = true;
    let accessToken = '';

    switch (true) {
      case pageRefresh:
        this.setState({ pageRefresh: false });
        getUserOnce(params.userId);
        break;
      case switchUser:
        this.setState({ switchUser: false });
        return getUserOnce(params.userId);
      case linkOneDrive:
        this.setState({linkOneDrive: false});
        accessToken = localStorage.getItem('msal.access.token');
        linkXboxDVR(auth.currentUser.uid, accessToken);
        //TODO: convert local storage to redux store
        // this.props.linkXboxDVR(false);
        localStorage.removeItem('msal.access.token');
        localStorage.setItem('linkDvr', false);
        break;
      case updateOneDrive:
        this.setState({updateOneDrive: false});
        accessToken = localStorage.getItem('msal.access.token');
        updateXboxDVR(accessToken, auth.xboxFileId, auth.currentUser.uid);
        //TODO: convert local storage to redux store
        // this.props.browseXboxDVR(false);
        localStorage.removeItem('msal.access.token');
        localStorage.setItem('browseDvr', false);
        break;
      default:
        return null;
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  renderUserUploads(uploads) {
    // if(_.isEmpty(uploads)){return null}
    return _.map(uploads, upload =>{
      return(
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard activeMenu={this.state.activeMenu} upload={upload}/>
        </Grid.Column>
      );
    })
  }

  renderUserFollowers(followers) {
    // if(_.isEmpty(followers)){return null}
    return _.map(followers, (follower) => {
      return (
        <Grid.Column key={follower.id}>
          <UserCard publisher={follower}/>
        </Grid.Column>
      )
    })
  }

  renderUserFollowing(following) {
    // if(_.isEmpty(following)){return null}
    return _.map(following, (followee) => {
      return (
        <Grid.Column key={followee.id}>
          <UserCard publisher={followee}/>
        </Grid.Column>
      )
    })
  }

  renderUserFavorites(favorites) {
    // if(_.isEmpty(favorites)){return null}
    return _.map(favorites, (favorite) => {
      return (
        <Grid.Column mobile={16} computer={8} largeScreen={5} key={favorite.id} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard activeMenu={this.state.activeMenu} upload={favorite}/>
        </Grid.Column>
      )
    });
  }

  getActiveMenu(state){
    const {user} = this.props;
    this.setState({ activeMenu: state, renderMenu: true, page: 1 });
    this.props.getUserUploadsTotal(user.data.id, state);
    this.props.getUserUploads( user.data.id, Date.now(), 1, state)
  }

  render() {
    const {user, uploads, auth} = this.props;
    const {activeMenu, page} = this.state;

    if(user.loading){return (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>)}
    if(_.isEmpty(auth.currentUser) || _.isEmpty(user.data)){return null}

    return (
      <div>
        <div style={{backgroundColor: '#1B1C1D'}}>
          <ProfileDetail user={user}/>
        </div>

        <div>
          <MenuProfile user={user} getActiveMenu={(state) => this.getActiveMenu(state)}/>
          {
            (activeMenu === 'uploads' || activeMenu === 'favorites') &&
            <Segment textAlign='center'>
              <Menu pagination>
                <Menu.Item as='a' icon onClick={() => this.retrievePrev()}>
                  <Icon name='chevron left' />
                </Menu.Item>
                <Menu.Item>
                  {page*10-10} - {uploads.count<10 ? uploads.count : page*10} of {uploads.count}
                </Menu.Item>
                <Menu.Item as='a' icon onClick={() => this.retrieveNext()}>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Segment>
          }
          {
            activeMenu === 'uploads' &&
            (
              <Container>
                <Grid stackable>
                  <Grid.Row>
                    {this.renderUserUploads(uploads.data)}
                  </Grid.Row>
                </Grid>
              </Container>
            )
          }
          {
            activeMenu === 'followers' &&
            (
              <Container>
                <Grid stackable columns={3}>
                  <Grid.Row>
                    {this.renderUserFollowers(user.data.followers)}
                  </Grid.Row>
                </Grid>
              </Container>
            )
          }
          {
            activeMenu === 'following' &&
            (
              <Container>
                <Grid stackable columns={3}>
                  <Grid.Row>
                    {this.renderUserFollowing(user.data.following)}
                  </Grid.Row>
                </Grid>
              </Container>

            )
          }
          {
            activeMenu === 'favorites' &&
            (
              <Container>
                <Grid stackable>
                  <Grid.Row>
                    {this.renderUserFavorites(uploads.data)}
                  </Grid.Row>
                </Grid>
              </Container>

            )
          }
          {
            activeMenu === 'playlist' &&
            (
              <PlaylistDetail user={user.data}/>
            )
          }
          {
            (activeMenu === 'uploads' || activeMenu === 'favorites') &&
            <Segment textAlign='center'>
              <Menu pagination>
                <Menu.Item as='a' icon
                           onClick={() => this.retrievePrev()}>
                  <Icon name='chevron left' />
                </Menu.Item>
                <Menu.Item>
                  {page*10-10} - {uploads.count<10 ? uploads.count : page*10} of {uploads.count}
                </Menu.Item>
                <Menu.Item as='a' icon
                           onClick={() => this.retrieveNext()}>
                  <Icon name='chevron right' />
                </Menu.Item>
              </Menu>
            </Segment>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user,
  uploads: state.uploads,
  favorites: state.favorites,
  oneDriveModal: state.oneDriveModal
});

export default connect(mapStateToProps,
  {getInitUser, getUserOnce, clearUser,
    getUserUploads, getNextUserUploads,getPrevUserUploads, getUserUploadsTotal, linkXboxDVR, updateXboxDVR, openOneDriveModal })(Profile);