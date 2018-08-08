import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Segment, Grid, Image } from "semantic-ui-react";

import {getUploadsOnce} from '../actions/actions.uploads';

import FeedCard from "../components/card/card.feed";
import _ from "lodash";
import FeaturedSlider from "../components/slider/slider.featured";
// import _ from 'lodash';

class Discover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Discover Container",
      status: 0,
      samePageLogin: false,
      loadingUploads: false,
      loadingFeatured: false,

      renderUploads: null,
      renderFeatured: null,

      updateUploads: false,
      updateFeatured: false
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
    {this.setState({samePageLogin: true})}
    else if(!_.isEmpty(nextProps.uploads.data) && (nextProps.uploads.data !== uploads.data))
    {this.setState({renderUploads: true})}
    // else if(!_.isEmpty(nextProps.featured.data) && (nextProps.featured.data !== featured.data)){this.setState({renderFeatured: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch(true){
      case (_.isEmpty(nextProps.auth.currentUser)):
        return false;
      case (nextState.samePageLogin):
        return true;
      case (nextState.renderUploads):
        return true;
      // case (nextState.renderFeatured):
      //   return true;
      // case (nextState.updateUploads):
      //   return true;
      // case (nextState.updateFeatured):
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
    // console.log(this.state.name, "Did Update", prevProps, prevState)
    const {getUploadsOnce, getFeaturesOnce, auth} = this.props;
    const {samePageLogin, renderUploads, renderFeatured} = this.state;

    switch(true) {
      case (samePageLogin):
        this.setState({ samePageLogin: false });
        return getUploadsOnce();
      case(renderUploads):
        return this.setState({ renderUploads: false });
      // case(renderFeatured):
      //   return this.setState({ renderFeatured: false });
      // case(updateUploads):
      //   this.setState({updateUploads: false});
      //   return getUploadsOnce(auth.currentUser.uid);
      // case(updateFeatured):
      //   this.setState({updateFeatured: false});
      //   return getFeaturedOnce(auth.currentUser.uid);
      default:
        return alert(this.state.name, '');
    }
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  renderUploads(uploads) {
    return _.map(uploads, (upload) => {
      // if(_.isEmpty(uploads)){return null}
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

    return (
      <Container fluid>
        <Container fluid >
          <Grid textAlign="center" style={{ backgroundColor: "black" }}>
            <Grid.Row>
              <Grid.Column width={16} style={{maxWidth: '720px'}}>
                <FeaturedSlider/>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>

        <Grid container stackable>
          <Grid.Row centered>
            {this.renderUploads(uploads.data)}
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  uploads: state.uploads,
  // featured: state.featured
});

export default connect(mapStateToProps,
  {getUploadsOnce})(Discover);