import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Container, Header, Grid, Segment} from 'semantic-ui-react'
import {getFeedOnce} from '../actions/actions.feed';
import {getLikesOnce} from "../actions/actions.likes";

import FeedCard from '../components/card/card.feed';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Home Container",
      status: 0
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
    // Initialize needed data for the home page on login
    if(auth.currentUser){
      getFeedOnce(auth.currentUser.uid, following);
      getLikesOnce(auth.currentUser.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    const {auth, feed, likes} = this.props;
    // Render true until prev and current props states are equal and data requested in not empty

    if((nextProps.auth.currentUser !== auth.currentUser) || _.isEmpty(feed.data)) {return true}
    if((nextProps.auth.currentUser !== auth.currentUser) || _.isEmpty(likes.data)){return true}

    return false;
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState);

    const {auth, following, getFeedOnce, getLikesOnce} = this.props;

    if(prevProps.auth.currentUser !== auth.currentUser){
      getFeedOnce(auth.currentUser.uid, following);
      getLikesOnce(auth.currentUser.uid);
    }
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  renderHomeFeed(feed) {
    if(!feed.data) { return null } // No Feed Data

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
    const {feed, auth} = this.props;

    if(_.isEmpty(auth.currentUser)) {return null}
    return (
      <Container>
        <Header>The Feed</Header>
        <Grid stackable column={2}>
          <Grid.Row centered>
            {this.renderHomeFeed(feed)}
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
  {getFeedOnce, getLikesOnce})(Home));
