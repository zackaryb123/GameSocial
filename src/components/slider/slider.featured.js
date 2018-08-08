import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import _ from "lodash";
import { Header, Grid, Image, Segment, Feed } from "semantic-ui-react";

import {getFeaturedOnce} from '../../actions/actions.featured';

import VideoPlayer from "../video/video.player";
import ViewsCount from "../count/count.views";
import FavoriteToggle from "../toggle/toggle.favorite";
import LikesToggle from "../toggle/toggle.like";
import FeaturedToggle from "../toggle/toggle.featured";
// import ViewsCount from "../count/count.views";
// import FavoriteToggle from "../toggle/toggle.favorite";
// import LikesToggle from "../toggle/toggle.like";
// import { FeaturedToggle } from "../toggle/toggle.featured";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  lazyLoad: true,
  slidesToShow: 1,
  slidesToScroll: 1
};

class FeaturedSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderFeatured: null,
      updateFeatured: null
    };
  }


  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");

  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    if(!_.isEmpty(this.props.auth.currentUser)) {
      this.props.getFeaturedOnce();
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {auth, featured} = this.props;
    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)){this.setState({samePageLogin: true})}
    else if(!_.isEmpty(nextProps.featured.data) && (nextProps.featured.data !== featured.data)){this.setState({renderFeatured: true})}
    else {console.log('Props up to date')}

  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    switch(true){
      case (nextState.samePageLogin):
        return true;
      case (nextState.renderFeatured):
        return true;
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
    const {getFeaturedOnce} = this.props;
    const {renderFeatured, samePageLogin} = this.state;

    switch(true) {
      case (samePageLogin):
        this.setState({samePageLogin: false});
        return getFeaturedOnce();
      case(renderFeatured):
        return this.setState({ renderFeatured: false });
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

  render() {
    const {auth, featured} = this.props;

    const hasList = !!this.props.featured.data;
    return hasList ? (
      <Slider {...settings}>
        {_.map(featured.data, feature => {
          return (
            <Segment basic key={feature.id} style={{ backgroundColor: "black" }}>
              <Segment inverted>
                <Feed>
                  <Feed.Event>
                    <Feed.Label><img src='https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png' /></Feed.Label>
                    <Feed.Content>
                      <Feed.Date style={white}>{feature.created_at}</Feed.Date>
                      <Feed.Summary style={white}>
                        <Link to={`/profile/${feature.publisher.id}`}>
                          {feature.publisher.username}</Link>
                      </Feed.Summary>
                      <Feed.Extra style={white} text>{feature.caption}</Feed.Extra>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Segment>
              {feature.type === 'video' && <VideoPlayer source={feature} options={feature.options} />}
              {feature.type === 'image' && <Image alt="upload" src={feature.url}/>}
              <Grid centered>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <Segment inverted style={{display: 'flex', justifyContent: 'space-between'}}>
                      <ViewsCount upload={feature}/>
                      <FavoriteToggle upload={feature} />
                      <LikesToggle upload={feature} />
                      {auth.currentUser.isAdmin && <FeaturedToggle upload={feature} />}
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          );
        })}
      </Slider>
    ) : (
      null
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  featured: state.featured
});

export default connect(mapStateToProps,{getFeaturedOnce})(FeaturedSlider);

const white = {
  color: 'white'
};
