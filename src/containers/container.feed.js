import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Container, Header, Grid, Segment} from 'semantic-ui-react'
import {getFeedOnce, clearFeed} from '../actions/actions.feed';
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
    if(!_.isEmpty(auth.currentUser)) {
      getFeedOnce(auth.currentUser.uid, following.data);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, feed} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser))
    {this.setState({samePageLogin: true})}
    else if(!_.isEmpty(nextProps.feed.data) && (nextProps.feed.data !== feed.data))
    {this.setState({renderFeed: true})}
    else{console.log('Props state up to date!')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);

    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      case (nextState.samePageLogin):
        return true;
      case (nextState.renderFeed):
        return true;
      // case (nextState.updateFeed):
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

    const {following, getFeedOnce, auth} = this.props;
    const {samePageLogin, renderFeed, updateFeed} = this.state;

    switch(true){
      case (samePageLogin):
        this.setState({samePageLogin: false});
        return getFeedOnce(auth.currentUser.uid, following.data);
      case(renderFeed):
        return this.setState({renderFeed: false});
      // case(updateFeed):
      //   this.setState({updateFeed: false});
      //   return getLikesOnce(auth.currentUser.uid);
      default:
        return alert(this.state.name, '');
    }
  }


  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
    this.props.clearFeed();
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

    if(_.isEmpty(auth.currentUser)){return null}

    return (
      <Container>
        <Segment>
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
  {getFeedOnce, clearFeed})(Feed));