import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import * as firebase from 'firebase';
import { Container, Header, Grid, Segment, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";
import {getInitFeed, getNextFeed, getPrevFeed} from '../actions/actions.feed';
import FeedCard from '../components/card/card.upload';

var moment = require("moment");
moment().format();

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Feed Container",
      count: 10,
      page: 1
    };
  }

  componentDidMount() {
    const {count, page} = this.state;
    const { auth, feed } = this.props;
    this.mounted = true;
    if (!_.isEmpty(auth.currentUser)) {
      this.props.getInitFeed(auth.currentUser.uid, moment(Date.now()).format(), 'init', page, count).then(data => {
        if(this.mounted){
          this.setState({
            // start: count * data.page - count,
            // date: data.date,
            // total: data.total
          })
        }
      });
    } else { console.log('No Remount')}
  }

  retrievePrev() {
    const { count, page, prevDate, start} = this.state;
    const {auth, feed} = this.props;
    const date =  feed.data[0].created_at;
    // if(start > 0){
      this.props.getPrevFeed(auth.currentUser.uid, date, 'prev', page, count).then(data => {
        this.setState({
          // date: data.date,
          // start: count * data.page - count ,
          // page: data.page,
          // total: data.total
        })
      });
    // }
  }

  retrieveNext() {
    const { count, total, page, start } = this.state;
    const {feed ,auth} = this.props;
    const date = feed.data[9].created_at;
    // this.setState({prevDate: feed.data[9].created_at});
    // if(start + count < total){
      this.props.getNextFeed(auth.currentUser.uid, date, 'next', page, count).then(data => {
        this.setState({
          // date: data.date,
          // start: count * data.page - count,
          // page: data.page,
          // total: data.total
        })
      });
    // }
  }

  componentWillReceiveProps(nextProps) {
    this.mounted = true;
    const {auth} = this.props;
    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)) {
      this.setState({pageRefresh: true})} // Handle refresh
    else{console.log('Props state up to date!')}
  }

  shouldComponentUpdate(nextProps, nextState) {
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {auth} = this.props;
    const {pageRefresh, page, count} = this.state;

    switch(true){
      case (pageRefresh):
        this.setState({pageRefresh: false});
        if(this.mounted){
          this.props.getInitFeed(auth.currentUser.uid, moment(Date.now()).format(), 'init', page, count).then(data => {
            this.setState({start: count * data.page - count, date: data.date, total: data.total})});
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
  {getInitFeed, getNextFeed, getPrevFeed})(Feed));

let cssTopPadding = {
  paddingTop: '0'
};

let cssBottomPadding = {
  paddingBottom: '0'
};