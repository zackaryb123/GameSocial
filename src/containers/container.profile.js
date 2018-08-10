import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Container, Image, Card, Segment, Dimmer, Loader } from "semantic-ui-react";

import {getInitUser, getUserOnce, clearUser} from "../actions/actions.user";

import FeedCard from '../components/card/card.feed';
import MenuProfile from "../components/menu/menu.profile";
import UserCard from '../components/card/card.user';
import ProfileDetail from '../components/detail/detail.profile';
//import PlaylistDetail from '../components/detail/detail.playlist';

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Profile Container',
      activeMenu: null
    }
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    const {match: {params}, auth, getInitUser, getUserOnce} = this.props;
    this.mount = true;

    if(!_.isEmpty(auth.currentUser)) {
      getInitUser(params.userId).then(user => {
        if(this.mount){
          getUserOnce(user.id);
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, user} = this.props;

    if (!_.isEmpty(nextProps.auth.currentUser) && nextProps.auth.currentUser !== auth.currentUser
    ) {this.setState({ samePageLogin: true });
    } else if (!_.isEmpty(nextProps.user.data) && nextProps.user.data !== user.data
    ) {this.setState({ renderUser: true });
    } else {console.log("Props state up to date!");}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch (true) {
      case _.isEmpty(nextProps.auth.currentUser):
        return false;
      case nextState.samePageLogin:
        return true;
      case nextState.renderUser:
        return true;
      case nextState.renderMenu:
        return true;
      // case (nextState.updateUser):
      //   return true;;
      default:
        return false;
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
    const { samePageLogin, renderUser, renderMenu } = this.state;

    switch (true) {
      case samePageLogin:
        this.setState({ samePageLogin: false });
        getInitUser(params.userId).then(user => { if(this.mount) {getUserOnce(user.id)} });
        break;
      case renderUser:
        return this.setState({ renderUser: false });
      case renderMenu:
        return this.setState({ renderMenu: false });
      //case updateUser:
      //   this.setState({updateUpload: false});
      //   return getUploadOnce(auth.currentUser.uid);
      default:
        return alert(this.state.name, "");
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
    const {user} = this.props;

    if(!user.data || user.loading){
      return (
        <Segment>
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          {/*<Image src="/images/wireframe/short-paragraph.png" />*/}
        </Segment>
      );
    }

    return (
      <div>
        <div style={{backgroundColor: '#1B1C1D'}}>
          <ProfileDetail user={user}/>
        </div>

        <div>
          <MenuProfile user={user} getActiveMenu={(state) => this.getActiveMenu(state)}/>
          {
            this.state.activeMenu === 'uploads' &&
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
            this.state.activeMenu === 'followers' &&
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
            this.state.activeMenu === 'following' &&
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
            this.state.activeMenu === 'favorites' &&
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
          {/*{*/}
            {/*this.state.activeMenu === 'playlist' &&*/}
            {/*(*/}
              {/*<Container fluid>*/}
                {/*<PlaylistDetail/>*/}
              {/*</Container>*/}
            {/*)*/}
          {/*}*/}
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