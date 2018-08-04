import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Container, Header, Grid, Segment} from 'semantic-ui-react'
import {getFeedOnce} from '../actions/actions.feed';
import {getLikesOnce} from "../actions/actions.likes";
import _ from 'lodash';

import FeedCard from '../components/card/card.feed';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Feed Container",
      status: 0,
      samePageLogin: null,
      renderFeed: null,
      renderLikes: null,
      renderFavorites: null,
      updateFeed: null,
      updateLikes: null,
      updateFavorites: null
    };
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");

    const {auth, following, getFeedOnce, getLikesOnce} = this.props;
    if(!_.isEmpty(auth.currentUser)){
      getFeedOnce(auth.currentUser.uid, following);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, feed, likes, favorites} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)){this.setState({samePageLogin: true})}
    else if(!_.isEmpty(nextProps.feed.data) && (nextProps.feed.data !== feed.data)){this.setState({renderFeed: true})}
    // TODO: Determine if better to initialize data in container or in individual components
    // else if(!_.isEmpty(nextProps.likes.data) && (nextProps.likes.data !== likes.data)){this.setState({renderLikes: true})}
    // else if(!_.isEmpty(nextProps.favorites.data) && (nextProps.favorites.data !== favorites.data)){this.setState({renderFavorites: true})}
    else{console.log('Props state up to date!')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      case (nextState.samePageLogin):
        return true;
      case (nextState.renderFeed):
        return true;
      // case (nextState.renderLikes):
      //   return true;
      // case (nextState.renderFavorites):
      //   return true;
      // case (nextState.updateFeed):
      //   return true;
      // case (nextState.updateLikes):
      //   return true;
      // case (nextState.updateFavorites):
      //   return true;
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
    // console.log(this.state.name, "Did Update", prevProps, prevState);

    const {following, getFeedOnce, getLikesOnce, auth} = this.props;
    const {samePageLogin, renderFeed, renderLikes, renderFavorites,
      updateFeed, updateLikes, updateFavorites} = this.state;

    switch(true){
      case (samePageLogin):
        this.setState({samePageLogin: false});
        return getFeedOnce(auth.currentUser.uid, following); // && getLikesOnce(auth.currentUser.uid)
      case(renderFeed):
        return this.setState({renderFeed: false});
      // case(renderLikes):
      //   return this.setState({renderLikes: false});
      // case(renderFavorites):
      //   return this.setState({renderFavorites: false});
      // case(updateFeed):
      //   this.setState({updateLikes: false});
      //   return getLikesOnce(auth.currentUser.uid);
      // case(updateLikes):
      //   this.setState({updateLikes: false});
      //   return getLikesOnce(auth.currentUser.uid);
      // case(updateFavorites):
      //   this.setState({updateFavorites: false});
      //   return getLikesOnce(auth.currentUser.uid);
      default:
        return alert(this.state.name, '');
    }
  }


  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
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
    console.log(this.state.name, 'Render');
    const {feed} = this.props;

    return (
      <Container>
        <Header>The Feed</Header>
        <Grid stackable column={2}>
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
  {getFeedOnce, getLikesOnce})(Feed));