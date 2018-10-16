import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import _ from "lodash";
import { Header, Grid, Image, Segment, Feed, Dimmer, Loader } from "semantic-ui-react";

import {getFeaturedOnce} from '../../actions/actions.featured';

import VideoPlayer from "../video/video.player";
import ViewsCount from "../count/count.views";
import FavoriteToggle from "../toggle/toggle.favorite";
import LikesToggle from "../toggle/toggle.like";
import FeaturedToggle from "../toggle/toggle.featured";
import FollowToggle  from '../toggle/toggle.following'
import PlaylistToggle from "../toggle/toggle.playlist";

const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  lazyLoad: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000
};

class FeaturedSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      renderFeatured: null,
      updateFeatured: null
    };
  }

  componentDidMount() {
    this.mounted = true;
    if(!_.isEmpty(this.props.auth.currentUser)) {
      this.props.getFeaturedOnce();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {auth} = this.props;
    if(!_.isEmpty(nextProps.auth.currentUser) && (nextProps.auth.currentUser !== auth.currentUser)){this.setState({pageRefresh: true})}
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
    const {getFeaturedOnce} = this.props;
    const {pageRefresh} = this.state;

    switch(true) {
      case (pageRefresh):
        this.setState({pageRefresh: false});
        getFeaturedOnce();
        break;
      default:return null;
    }
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  render() {
    const {auth, featured} = this.props;

    if(featured.loading){return (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>)}
    if(_.isEmpty(auth.currentUser) || _.isEmpty(featured.data)){return null}

    const hasList = !!this.props.featured.data;
    return hasList ? (
      <Slider {...settings}>
        {_.map(featured.data, feature => {
          return (
            <Segment basic key={feature.id}>
              {/*style={{ backgroundColor: "#1B1C1D" }}>*/}
              <Segment inverted>
                <Feed>
                  <Feed.Event>
                    <Feed.Label><img src={feature.publisher.avatar} /></Feed.Label>
                    <Feed.Content>
                      <Feed.Date style={white}>{feature.created_at}</Feed.Date>
                      <Feed.Summary style={white}>
                        <Link to={`/profile/${feature.publisher.id}`}>
                          {feature.publisher.username}</Link>
                      </Feed.Summary>
                      <Feed.Extra as={Link} to={`/upload/${feature.publisher.id}/uploads/${feature.id}`} style={white} text>{feature.caption}</Feed.Extra>
                      {auth.currentUser.uid !== feature.publisher.id && <FollowToggle publisher={feature.publisher}/>}
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
                      {feature.type === 'video' && <PlaylistToggle upload={feature}/>}
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