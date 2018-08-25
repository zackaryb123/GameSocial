import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import _ from 'lodash';
import { Grid, Header, Container, Image, Card, Segment, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";

import {getInitUser, getUserOnce, clearUser} from "../actions/actions.user";
import { getUserUploads, getNextUserUploads,getPrevUserUploads } from "../actions/actions.uploads";

import FeedCard from '../components/card/card.upload';
import MenuProfile from "../components/menu/menu.profile";
import UserCard from '../components/card/card.user';
import ProfileDetail from '../components/detail/detail.profile';
import PlaylistDetail from '../components/detail/detail.playlist';

var moment = require("moment");
moment().format();

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
    this.setState({count: 10,start: 0, page: 1})
  }

  componentDidMount(){
    const {match: {params}, auth, getUserOnce} = this.props;
    this.mount = true;

    if(!_.isEmpty(auth.currentUser)) {
      getUserOnce(params.userId);
    }
  }

  retrievePrev() {
    const { count, page, start, activeMenu} = this.state;
    const {user, uploads} = this.props;
    const date =  uploads.data[0].created_at;
    // if(start > 0){
      this.props.getPrevUserUploads(user.data.id, date, page, count, activeMenu).then(data => {
        this.setState({ date: data.date, start: count * data.page - count , page: data.page, total: data.total })
      });
    // }
  }

  retrieveNext() {
    const { count, total, page, start, activeMenu } = this.state;
    const {user, uploads} = this.props;
    const date = uploads.data[uploads.data.length - 1].created_at;

    // if(start + count < total) {
      this.props.getNextUserUploads(user.data.id, date, page, count, activeMenu).then(data => {
        this.setState({ date: data.date, start: count * data.page - count, page: data.page, total: data.total })
      })
    // }
  }

  componentWillReceiveProps(nextProps) {
    const {auth, match: {params}} = this.props;
    if (!_.isEmpty(nextProps.auth.currentUser) && nextProps.auth.currentUser !== auth.currentUser) {
      this.setState({ pageRefresh: true });
    } else if (nextProps.match.params.userId !== params.userId){
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
    const {getUserOnce, match: {params} } = this.props;
    const { samePageLogin, switchUser } = this.state;
    this.mounted = true;

    switch (true) {
      case samePageLogin:
        this.setState({ samePageLogin: false });
        return getUserOnce(params.userId);
      case switchUser:
        this.setState({ switchUser: false });
        return getUserOnce(params.userId);
      default:
        return null;
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }


  renderUserUploads(uploads) {
    return _.map(uploads, upload =>{
      return(
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard activeMenu={this.state.activeMenu} upload={upload}/>
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
          <FeedCard activeMenu={this.state.activeMenu} upload={favorite}/>
        </Grid.Column>
      )
    });
  }

  getActiveMenu(state){
    const {user} = this.props;
    const page = 1;
    const count = 10;

    this.setState({ activeMenu: state, renderMenu: true });
      this.props.getUserUploads( user.data.id, moment(Date.now()).format(), page, count, state).then(data =>{
        if(this.mounted){
          this.setState({
            start: count * data.page - count,
            date: data.date,
            total: data.total })
        }
      });
  }

  render() {
    const {user, uploads, auth} = this.props;
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
            (activeMenu === 'uploads' || activeMenu === 'favorites') &&
            <Segment textAlign='center'>
              <Menu pagination>
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
                  {this.state.start}- {this.state.start+this.state.count} of {this.state.total}
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
  favorites: state.favorites
});

export default connect(mapStateToProps,
  {getInitUser, getUserOnce, clearUser,
    getUserUploads, getNextUserUploads,getPrevUserUploads })(Profile);