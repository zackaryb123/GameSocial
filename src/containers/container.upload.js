import React, { Component } from "react";
import { connect } from "react-redux";
import {Link} from 'react-router-dom';
import { Grid, Container, Segment, Dimmer, Loader, Image, Header, Item, Feed } from "semantic-ui-react";
import { getUploadOnce, clearUpload } from "./../actions/actions.upload";

import Comments from "../components/comments/comments";
import ViewsCount from "../components/count/count.views";
import FavoriteToggle from "../components/toggle/toggle.favorite";
import LikesToggle from "../components/toggle/toggle.like";
import FeaturedToggle from "../components/toggle/toggle.featured";
import PlaylistToggle from "../components/toggle/toggle.playlist";
import VideoPlayer from "../components/video/video.player";
import _ from "lodash";
import FollowToggle from "../components/toggle/toggle.following";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Upload Container",
      pageRefresh: null,
    };
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    const {auth, match: { params }, getUploadOnce } = this.props;
    if(!_.isEmpty(auth.currentUser)) {
      getUploadOnce(params.uploadId);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const { upload, auth } = this.props;

    if (!_.isEmpty(nextProps.auth.currentUser) && nextProps.auth.currentUser !== auth.currentUser
    ) {this.setState({ pageRefresh: true });
    // } else if (!_.isEmpty(nextProps.upload.data) && nextProps.upload.data !== upload.data
    // ) {this.setState({ renderUpload: true });
    } else {console.log("Props state up to date!");}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);

    switch (true) {
      case _.isEmpty(nextProps.auth.currentUser):
        return false;
      case nextState.pageRefresh:
        this.forceUpdate();
        return false;
      default:
        return true;
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState);
    const {getUploadOnce, upload } = this.props;
    const { pageRefresh } = this.state;

    switch (true) {
      case pageRefresh:
        this.setState({ pageRefresh: false });
        return getUploadOnce(upload.data.id);
      default: return null;
    }
  }

  componentWillUnmount() {
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
    this.props.clearUpload();
  }

  render() {
    const { upload, auth } = this.props;

    if (upload.loading){return (<Segment><Dimmer active><Loader>Loading</Loader></Dimmer></Segment>)}
    if(_.isEmpty(auth.currentUser) || _.isEmpty(upload.data)){return null}


    return (
      <div>
        <div>
          <Grid textAlign="center" style={{ backgroundColor: "#1B1C1D" }}>
            <Grid.Row className="row">
              <Grid.Column width={16} style={{maxWidth: '720px'}}>
                <Segment inverted>
                  <Feed>
                    <Feed.Event>
                      <Feed.Label><img src='https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png' /></Feed.Label>
                      <Feed.Content>
                        <Feed.Date style={white}>{upload.data.created_at}</Feed.Date>
                        <Feed.Summary style={white}>
                          <Link to={`/profile/${upload.data.publisher.id}`}>
                            {upload.data.publisher.username}</Link>
                        </Feed.Summary>
                        <Feed.Extra style={white} text>{upload.data.caption}</Feed.Extra>
                        {auth.currentUser.uid !== upload.data.publisher.id && <FollowToggle publisher={upload.data.publisher}/>}
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                </Segment>
                {upload.data.type === 'video' && <VideoPlayer source={upload.data} options={upload.data.options} />}
                {upload.data.type === 'image' && <Image alt="upload" src={upload.data.url}/>}
                <Grid centered>
                  <Grid.Row>
                    <Grid.Column width={16}>
                      <Segment inverted style={{display: 'flex', justifyContent: 'space-between'}}>
                        <ViewsCount upload={upload.data}/>
                        <FavoriteToggle upload={upload.data} />
                        <LikesToggle upload={upload.data} />
                        {upload.data.type === 'video' && <PlaylistToggle upload={upload.data}/>}
                        {auth.currentUser.isAdmin && <FeaturedToggle upload={upload.data} />}
                      </Segment>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>

        <Grid>
          <Grid.Row centered>
            <Grid.Column width={16}>
              <Comments />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  upload: state.upload,
  auth: state.auth,
  likes: state.likes,
  favorites: state.favorites,
  viewsCount: state.viewsCount
});

export default connect(
  mapStateToProps,
  { getUploadOnce, clearUpload }
)(Upload);


const white = {
  color: 'white'
};

const blue = {
  color: '#1e70bf'
};

const followBtn = {
  backgroundColor: '#1B1C1D',
  position: 'absolute',
  right: '0',
  top: '0',
  bottom: '0',
  padding: '.5rem .5rem',
  margin: '0',
  border: 'none'
};