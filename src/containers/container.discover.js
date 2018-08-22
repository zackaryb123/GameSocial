import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Segment, Grid, Image, Dimmer, Loader, Table, Menu, Icon } from "semantic-ui-react";
import {getUploadsOnce, getNextUploadsOnce, getPrevUploadsOnce} from '../actions/actions.uploads';

import FeedCard from "../components/card/card.upload";
import _ from "lodash";
import FeaturedSlider from "../components/slider/slider.featured";
// import _ from 'lodash';

class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Discover Container",
    };
  }


  componentWillMount() {
    this.setState({count: 10,start: 0, page: 1})
  }

  componentDidMount() {
    const {auth} = this.props;
    const {page, count} = this.state;

    if(!_.isEmpty(auth.currentUser)){
      this.props.getUploadsOnce(Date.now(), page, count).then(data => {
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
    const {uploads} = this.props;

    const date =  uploads.data[0].created_at;
    console.log(date);

    if(start > 0){
      this.props.getPrevUploadsOnce(date, page, count).then(data => {
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
    const {auth, uploads} = this.props;

    const date = uploads.data[uploads.data.length-1].created_at;

    if(start + count < total){
      this.props.getNextUploadsOnce(date, page, count).then(data => {
        this.setState({
          date: data.date,
          page:data.page,
          start: count * data.page - count,
          total: data.total
        })
      });

    }
  }

  componentWillReceiveProps(nextProps) {
    const {auth} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser))
    {this.setState({pageRefresh: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      default: return true;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState)
    this.mounted = true;
    const {getUploadsOnce} = this.props;
    const {pageRefresh, page, count} = this.state;

    switch(true) {
      case (pageRefresh):
        this.setState({ pageRefresh: false });
        if(this.mounted){
          getUploadsOnce(Date.now(), page, count).then(data => {
            if(this.mounted){
              this.setState({
                start: count * data.page - count,
                date: data.date,
                total: data.total })
            }
          });
        } else { console.log('No Remount')}
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
        <Segment basic textAlign='center' style={{backgroundColor: '#1B1C1D'}}>
          <Header style={{color: 'white'}}>Featured</Header>
        </Segment>

        <div>
          <Grid textAlign="center" style={{ backgroundColor: "#1B1C1D" }}>
            <Grid.Row>
              <Grid.Column width={16} style={{maxWidth: '720px'}}>
                <FeaturedSlider/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

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
                {this.state.start}- {this.state.start+this.state.count} of {this.state.total}
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
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uploads: state.uploads,
  featured: state.featured
});

export default connect(mapStateToProps,
  {getUploadsOnce,getNextUploadsOnce, getPrevUploadsOnce})(Discover);