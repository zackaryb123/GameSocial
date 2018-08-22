import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as firebase from 'firebase';
import { Container, Header, Grid, Segment, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";
import {getFeedOnce, getNextFeedOnce, getPrevFeedOnce} from '../actions/actions.feed';
import FeedCard from '../components/card/card.upload';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Feed Container",
    };
  }

  componentWillMount() {
    this.setState({count: 10,start: 0, page: 1})
  }

  componentDidMount() {
    const { auth } = this.props;
    const {page, count, start} = this.state;
    this.mounted = true;
    if (!_.isEmpty(auth.currentUser)) {
      this.props.getFeedOnce(auth.currentUser.uid, Date.now(), page, count).then(data => {
        if(this.mounted){
          this.setState({
            start: count * data.page - count,
            date: data.date,
            total: data.total })
        }
      });
    } else { console.log('No Remount')}
  }

  retrievePrev() {
    const { count, page, start} = this.state;
    const {auth, feed} = this.props;

    const date =  feed.data[0].created_at;
    console.log(date);

    if(start > 0){
      this.props.getPrevFeedOnce(auth.currentUser.uid, date, page, count).then(data => {
        this.setState({
          date: data.date,
          start: count * data.page - count ,
          page: data.page,
          total: data.total
        })
      })
    }
  }

  retrieveNext() {
    const { count, total, page, start } = this.state;
    const {auth, feed} = this.props;

    const date = feed.data[feed.data.length-1].created_at;

    if(start + count < total){
      this.props.getNextFeedOnce(auth.currentUser.uid, date, page, count).then(data => {
        this.setState({
          date: data.date,
          page: data.page,
          start: count * data.page - count,
          total: data.total
        })
      });

    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    this.mounted = true;
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
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState);

    const {getFeedOnce, auth} = this.props;
    const {pageRefresh, page, count, start } = this.state;

    switch(true){
      case (pageRefresh):
        this.setState({pageRefresh: false});
        if(this.mounted){
          getFeedOnce(auth.currentUser.uid, Date.now(), page, count).then(data => {
            this.setState({ date: data.date, total: data.total})})
        }
        break;
      default: return null;
    }
  }


  componentWillUnmount(){
    this.mounted = false;
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
    if(_.isEmpty(auth.currentUser) || _.isEmpty(feed.data)){return null}

    return (
      <Container style={[cssTopPadding, cssBottomPadding]}>
        <Segment textAlign='center' style={{backgroundColor: 'coral'}}>
          <Header>Feed {this.state.page}</Header>
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
        <Grid stackable>
          <Grid.Row centered>
            {this.renderFeed(feed)}
          </Grid.Row>
        </Grid>
        <div>
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
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  feed: state.feed,
  lazyFeed: state.lazyFeed,
  likes: state.likes
});

export default (connect(mapStateToProps,
  {getFeedOnce,getNextFeedOnce, getPrevFeedOnce})(Feed));

let cssTopPadding = {
  paddingTop: '0'
};

let cssBottomPadding = {
  paddingBottom: '0'
};