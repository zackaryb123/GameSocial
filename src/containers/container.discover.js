import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Segment, Grid, Image, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";
import {getUploads, getNextUploads, getPrevUploads} from '../actions/actions.uploads';

import FeedCard from "../components/card/card.upload";
import _ from "lodash";
import FeaturedSlider from "../components/slider/slider.featured";

var moment = require("moment");
moment().format();

class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Discover Container",
      page: 1
    };
  }

  componentDidMount() {
    const {auth} = this.props;
    const {page, count} = this.state;

    if(!_.isEmpty(auth.currentUser)){
      this.props.getUploads(Date.now())
    } else { console.log('No Remount')}
  }

  retrievePrev() {
    const {page} = this.state;
    const {uploads, auth} = this.props;

    if(!_.isEmpty(uploads.data)){
      const date =  uploads.data[0].created_at;
      if(page > 1){
        this.props.getPrevUploads(date);
        this.setState({page: page-1});
      }
    }
  }

  retrieveNext() {
    const { count, total, page, start } = this.state;
    const {auth, uploads} = this.props;

    if(!_.isEmpty(uploads.data)){
      const date = uploads.data[uploads.data.length-1].created_at;
      if(!_.isEmpty(uploads.data[9])){
        this.props.getNextUploads(date);
        this.setState({page: page+1});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {auth} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser))
    {this.setState({pageRefresh: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    this.mounted = true;
    const {auth} = this.props;
    const {pageRefresh, page, count} = this.state;

    switch(true) {
      case (pageRefresh):
        this.setState({ pageRefresh: false });
        if(this.mounted){
          this.props.getUploads(Date.now());
        }
        break;
      default: return null;
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  renderUploads(uploads) {
    return _.map(uploads, (upload) => {
      return (
        <Grid.Column key={upload.id} mobile={16} computer={8} largeScreen={5} style={{paddingBottom: '1rem', paddingTop: '.5rem'}}>
          <FeedCard upload={upload}/>
        </Grid.Column>
      );
    });
  }

  render() {
    const {auth, uploads} = this.props;

    if(_.isEmpty(auth.currentUser) || _.isEmpty(uploads.data)){return null}

    return (
      <div>
        <Container>
        <div style={{marginTop: '2rem'}}>
          <Segment textAlign='center' style={{backgroundColor: 'coral'}}>
            <Header>Discover</Header>
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
        {
          uploads.loading ? (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>):
          <Grid container stackable>
            <Grid.Row centered>
              {this.renderUploads(uploads.data)}
              </Grid.Row>
          </Grid>
        }
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uploads: state.uploads
});

export default connect(mapStateToProps,
  {getUploads, getNextUploads, getPrevUploads})(Discover);