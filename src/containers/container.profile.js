import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Container, Image, Card, Segment, Dimmer, Loader } from "semantic-ui-react";

import {getInitUser, getUserOnce, clearUser} from "../actions/actions.user";

import FeedCard from '../components/card/card.upload';
import MenuProfile from "../components/menu/menu.profile";
import UserCard from '../components/card/card.user';
import ProfileDetail from '../components/detail/detail.profile';
import PlaylistDetail from '../components/detail/detail.playlist';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Profile Container',
      activeMenu: null,
      pageRefresh: null
    }
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    console.log(this.state.name,"Did Mount");
    const {match: {params}, auth, getInitUser, getUserOnce} = this.props;
    this.mount = true;

    if(!_.isEmpty(auth.currentUser)) {
      getUserOnce(params.userId);
    }
  }
  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, user, match: {params}} = this.props;
    if (!_.isEmpty(nextProps.auth.currentUser) && nextProps.auth.currentUser !== auth.currentUser) {
      this.setState({ pageRefresh: true });
    }
    // else if (nextProps.user.data && (nextProps.user.data !== user.data)){
    //   this.setState({ updateProfile: true });
    // }
    else if (nextProps.match.params.userId !== params.userId){
      this.setState({ switchUser: true });
    }
    else {console.log("Props state up to date!");}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch (true) {
      case _.isEmpty(nextProps.auth.currentUser):
        return false;
      case nextState.pageRefresh:
        this.forceUpdate();
        return false;
      case nextState.switchUser:
        this.forceUpdate();
        return false;
      // case nextState.updateProfile:
      //   this.forceUpdate();
      //   return false;
      default:
        return true;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState)
    const {getUserOnce, auth, user, getInitUser, match: {params} } = this.props;
    const { samePageLogin, switchUser, updateProfile } = this.state;

    switch (true) {
      case samePageLogin:
        this.setState({ samePageLogin: false });
        return getUserOnce(params.userId);
      case switchUser:
        this.setState({ switchUser: false });
        return getUserOnce(params.userId);
      // case updateProfile:
      //   this.setState({ updateProfile: false });
      //   return getUserOnce(user.data.id);
      default:
        return null;
    }
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
    this.mount = false;
  }


  renderUserUploads(uploads) {
    return _.map(uploads, upload =>{
      return(
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard upload={upload}/>
        </Grid.Column>
      );
    })
  }

  renderUserFollowers(followers) {
    return _.map(followers, (follower) => {
      return (
        <Grid.Column key={follower.id}>
          <UserCard publisher={follower}/>
        </Grid.Column>
      )
    })
  }

  renderUserFollowing(following) {
    return _.map(following, (followee) => {
      return (
        <Grid.Column key={followee.id}>
          <UserCard publisher={followee}/>
        </Grid.Column>
      )
    })
  }

  renderUserFavorites(favorites) {
    return _.map(favorites, (favorite) => {
      return (
        <Grid.Column mobile={16} computer={8} largeScreen={5} key={favorite.id} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard upload={favorite}/>
        </Grid.Column>
      )
    });
  }

  getActiveMenu(state){
    this.setState({
      activeMenu: state,
      renderMenu: true
    })
  }

  render() {
    const {user, auth} = this.props;
    const {activeMenu} = this.state;

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
            activeMenu === 'uploads' &&
            (
              <Container>
                <Grid stackable>
                  <Grid.Row>
                    {this.renderUserUploads(user.data.uploads)}
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
                    {this.renderUserFavorites(user.data.favorites)}
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  user: state.user
});

export default connect(mapStateToProps,
  {getInitUser, getUserOnce, clearUser})(Profile);