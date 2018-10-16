import React, { Component } from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import { Container, Header, Grid, Segment, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";
import {getUserUploads, getNextUserUploads, getPrevUserUploads} from "../actions/actions.uploads";
import {setFeed} from '../actions/actions.user.services';
import FeedCard from '../components/card/card.upload';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Feed Container",
      page: 1
    };
  }

  componentDidMount() {
    const {count, page} = this.state;
    const { auth } = this.props;
    this.mounted = true;
    if (!_.isEmpty(auth.currentUser)) {
      this.props.setFeed(auth.currentUser.uid);
      this.props.getUserUploads(auth.currentUser.uid, Date.now(), page, 'feed');
      // this.props.getFeedUploads(auth.currentUser.uid, Date.now());
      this.setState({page: 1})
    } else { console.log('No Remount')}
  }

  retrievePrev() {
    const { page } = this.state;
    const { auth, uploads } = this.props;

    if(!_.isEmpty(uploads.data)) {
      const date = uploads.data[0].created_at;
      if(page > 1){
        this.props.getPrevUserUploads(auth.currentUser.uid, date, page, 'feed');
        // this.props.getPrevFeedUploads(auth.currentUser.uid, date);
        this.setState({page: page-1})
      }
    }
  }

  retrieveNext() {
    const { count, total, page, start } = this.state;
    const {uploads, auth} = this.props;

    if(!_.isEmpty(uploads.data)) {
      const date = uploads.data[uploads.data.length-1].created_at;
      if(!_.isEmpty(uploads.data[9])){
        this.props.getNextUserUploads(auth.currentUser.uid, date, page, 'feed');
        // this.props.getNextFeedUploads(auth.currentUser.uid, date);
        this.setState({page: page+1})
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.mounted = true;
    const {auth} = this.props;
    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)) {
      this.setState({pageRefresh: true})}
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
          this.props.setFeed(auth.currentUser.uid);
          this.props.getUserUploads(auth.currentUser.uid, Date.now(), page, 'feed')
          // this.props.getFeedUploads(auth.currentUser.uid, Date.now());
        }
        break;
      default: return null;
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  renderFeed(uploads) {
    return _.map(uploads.data, upload =>{
      return(
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
            <FeedCard upload={upload}/>
        </Grid.Column>
      );
    })
  }

  render() {
    const {uploads, auth} = this.props;

    if(uploads.loading){return (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>)}
    if(_.isEmpty(auth.currentUser) || _.isEmpty(uploads.data)){return null}

    return (
      <Container style={[cssTopPadding, cssBottomPadding]}>
        <Segment textAlign='center' style={{backgroundColor: 'coral'}}>
          <Header>Feed</Header>
          <Menu pagination>
            <Menu.Item as='a' icon
                       onClick={() => this.retrievePrev()}>
              <Icon name='chevron left' />
            </Menu.Item>
              <Menu.Item>
                {this.state.page}
              </Menu.Item>
            <Menu.Item as='a' icon
                       onClick={() => this.retrieveNext()}>
              <Icon name='chevron right' />
            </Menu.Item>
          </Menu>
        </Segment>
        <Grid stackable>
          <Grid.Row centered>
            {this.renderFeed(uploads)}
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
                {this.state.page}
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
  uploads: state.uploads
});

export default (connect(mapStateToProps,
  { getUserUploads, getNextUserUploads, getPrevUserUploads,
    setFeed})(Feed));

let cssTopPadding = {
  paddingTop: '0'
};

let cssBottomPadding = {
  paddingBottom: '0'
};