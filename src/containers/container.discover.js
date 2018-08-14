import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Segment, Grid, Image, Dimmer, Loader } from "semantic-ui-react";

import {getUploadsOnce} from '../actions/actions.uploads';

import FeedCard from "../components/card/card.upload";
import _ from "lodash";
import FeaturedSlider from "../components/slider/slider.featured";
// import _ from 'lodash';

class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Discover Container",
      status: 0,
      pageRefresh: false
    };
  }


  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    const {auth} = this.props;
    if(!_.isEmpty(auth.currentUser)){
      this.props.getUploadsOnce();
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, uploads} = this.props;

    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser))
    {this.setState({pageRefresh: true})}
    // else if(!_.isEmpty(nextProps.uploads.data) && (nextProps.uploads.data !== uploads.data))
    // {this.setState({renderUploads: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
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
    // console.log(this.state.name, "Did Update", prevProps, prevState)
    const {getUploadsOnce} = this.props;
    const {pageRefresh} = this.state;

    switch(true) {
      case (pageRefresh):
        this.setState({ pageRefresh: false });
        return getUploadsOnce();
      default: return null;
    }
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
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

    if(_.isEmpty(auth.currentUser)){return null}

    if(!uploads.data || uploads.loading){
      return (
        <Segment>
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          {/*<Image src="/images/wireframe/short-paragraph.png" />*/}
        </Segment>
      );
    }

    return (
      <div>
        <Container style={{marginBottom: '2rem'}}>
          <Segment textAlign='center' style={{backgroundColor: 'coral'}}>
            <Header>Featured</Header>
          </Segment>
        </Container>

        <div >
          <Grid textAlign="center" style={{ backgroundColor: "#1B1C1D" }}>
            <Grid.Row>
              <Grid.Column width={16} style={{maxWidth: '720px'}}>
                <FeaturedSlider/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        <Container style={{marginTop: '2rem'}}>
          <Segment textAlign='center' style={{backgroundColor: 'coral'}}>
            <Header>Discover</Header>
          </Segment>
        </Container>

        <Grid container stackable>
          <Grid.Row centered>
            {this.renderUploads(uploads.data)}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uploads: state.uploads,
});

export default connect(mapStateToProps,
  {getUploadsOnce})(Discover);