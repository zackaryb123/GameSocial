import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Grid, Segment, Dimmer, Loader, Image } from "semantic-ui-react";
import {getFeedOnce, clearFeed} from '../actions/actions.feed';
import {getInitFollowing} from '../actions/actions.following';
import _ from 'lodash';

import FeedCard from '../components/card/card.upload';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Feed Container",
      status: 0,
      pageRefresh: null,
    };
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, "Did Mount");
    const { auth, getFeedOnce, getInitFollowing, following } = this.props;
    this.mount = true;
    if (!_.isEmpty(auth.currentUser)) {
      getInitFollowing(auth.currentUser.uid).then(followingList => { if(this.mount) { // Handle remount
        getFeedOnce(auth.currentUser.uid, followingList);
        this.setState({ renderFollow: true })}});
    } else{ console.log('No Remount')}
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth} = this.props;
    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)) {
      this.setState({pageRefresh: true})} // Handle refresh
    else{console.log('Props state up to date!')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      case (nextState.pageRefresh):
        this.forceUpdate();
        return false;
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState);

    const {getFeedOnce, auth, getInitFollowing} = this.props;
    const {pageRefresh} = this.state;

    switch(true){
      case (pageRefresh):
        this.setState({pageRefresh: false});
        getInitFollowing(auth.currentUser.uid).then(followingList => {
          if(this.mount){getFeedOnce(auth.currentUser.uid, followingList)}});
        break;
      default: return null;
    }
  }


  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
    this.mount = false;
  }

  renderFeed(feed) {
    return _.map(feed.data, upload =>{
      return(
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard upload={upload}/>
        </Grid.Column>
      );
    })
  }

  render() {
    const {feed, auth} = this.props;

    if(feed.loading){return (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>)}
    if(_.isEmpty(auth.currentUser) || isEmpty(feed.data)){return null}

    return (
      <Container>
        <Segment style={{backgroundColor: 'coral'}}>
          <Header>The Feed</Header>
        </Segment>
        <Grid stackable>
          <Grid.Row centered>
            {this.renderFeed(feed)}
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  feed: state.feed,
  following: state.following,
  likes: state.likes
});

export default (connect(mapStateToProps,
  {getFeedOnce, clearFeed, getInitFollowing})(Feed));