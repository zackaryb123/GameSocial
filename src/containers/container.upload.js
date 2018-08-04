import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Container, Segment, Dimmer, Loader, Image, Card } from "semantic-ui-react";

import { getUploadOnce } from "./../actions/actions.upload";

import Comments from "../components/comments/comments";
import UserCard from "../components/card/card.user";
import ViewsCount from "../components/count/count.views";
import FavoriteToggle from "../components/toggle/toggle.favorite";
import LikesToggle from "../components/toggle/toggle.like";
import FeaturedToggle from "../components/toggle/toggle.featured";
import PlaylistToggle from "../components/toggle/toggle.playlist";
import VideoPlayer from "../components/video/video.player";
import _ from "lodash";

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Upload Container",
      samePageLogin: null,

      renderUpload: null,
      renderLikes: null,
      renderFavorites: null,
      renderViews: null,

      updateUpload: null,
      updateLikes: null,
      updateFavorites: null,
      updateViews: null
    };
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
    const {
      match: { params },
      getUploadOnce
    } = this.props;
    getUploadOnce(params.uploadId);
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);
    const { upload, auth, viewsCount, likes, favorites } = this.props;

    if (
      !_.isEmpty(nextProps.auth.currentUser) &&
      nextProps.auth.currentUser !== auth.currentUser
    ) {
      this.setState({ samePageLogin: true });
    } else if (
      !_.isEmpty(nextProps.upload) &&
      nextProps.upload.data !== upload.data
    ) {
      this.setState({ renderUpload: true });
    }
    // TODO: Determine if better to initialize data in container or in individual components
    // else if(!_.isEmpty(nextProps.likes.data) && (nextProps.likes.data !== likes.data)){this.setState({renderLikes: true})}
    // else if(!_.isEmpty(nextProps.favorites.data) && (nextProps.favorites.data !== favorites.data)){this.setState({renderFavorites: true})}
    // else if (!_.isEmpty(nextProps.viewsCount.data) && nextProps.viewsCount.data !== viewsCount.data){this.setState({ renderViews: true })}
    else {
      console.log("Props state up to date!");
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    switch (true) {
      case _.isEmpty(nextProps.auth.currentUser):
        return false;
      case nextState.samePageLogin:
        return true;
      case nextState.renderUpload:
        return true;
      // case (nextState.renderLikes):
      //   return true;
      // case (nextState.renderFavorites):
      //   return true;
      // case (nextState.updateUpload):
      //   return true;
      // case (nextState.updateLikes):
      //   return true;
      // case (nextState.updateFavorites):
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
    // console.log(this.state.name, "Did Update", prevProps, prevState);
    const {getUploadOnce, getLikesOnce, auth, upload } = this.props;
    const {
      samePageLogin,
      renderUpload,
      renderLikes,
      renderFavorites,
      updateFeed,
      updateLikes,
      updateFavorites
    } = this.state;

    switch (true) {
      case samePageLogin:
        this.setState({ samePageLogin: false });
        return getUploadOnce(upload.data.id);
      case renderUpload:
        return this.setState({ renderUpload: false });
      // case(renderLikes):
      //   return this.setState({renderLikes: false});
      // case(renderFavorites):
      //   return this.setState({renderFavorites: false});
      // case(updateUpload):
      //   this.setState({updateUpload: false});
      //   return getLikesOnce(auth.currentUser.uid);
      // case(updateLikes):
      //   this.setState({updateLikes: false});
      //   return getLikesOnce(auth.currentUser.uid);
      // case(updateFavorites):
      //   this.setState({updateFavorites: false});
      //   return getLikesOnce(auth.currentUser.uid);
      default:
        return alert(this.state.name, "");
    }
  }

  componentWillUnmount() {
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  render() {
    const { upload, auth } = this.props;

    if (!upload.data) {
      return null
    }

    if (upload.loading) {
      return (
        <Segment>
          <Dimmer active>
            <Loader>Loading</Loader>
          </Dimmer>
          <Image src="/images/wireframe/short-paragraph.png" />
        </Segment>
      );
    }
    return (
      <Container fluid>
      <Container fluid>
        <Grid textAlign="center" style={{ backgroundColor: "black" }}>
          <Grid.Row className="row">
            <Grid.Column width={15}>
              {upload.data.type === 'video' && <VideoPlayer source={upload.data} options={upload.data.options} />}
              {upload.data.type === 'image' && <Image alt="upload" src={upload.data.url}/>}
            </Grid.Column>
            <Grid centered>
              <Grid.Row>
                <Grid.Column width={15}>
                  <Segment.Group>
                    <Segment.Group horizontal>
                      <Segment>
                        <LikesToggle upload={upload.data} />
                      </Segment>
                      <Segment>
                        <ViewsCount upload={upload.data}/>
                      </Segment>
                      <Segment>
                        <FavoriteToggle upload={upload.data} />
                        {auth.currentUser &&
                        auth.currentUser.isAdmin && (
                          <div>
                            <span style={{ float: "left" }}>Featured</span>
                            <FeaturedToggle upload={upload.data} />
                          </div>
                        )}
                      </Segment>
                    </Segment.Group>
                  </Segment.Group>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Row>
        </Grid>
      </Container>
      <Container>
        <Grid stackable stretched centered>
          <Grid.Row>
            <Grid.Column width={10}>
              <Segment>
                <h1>{upload.data.caption}</h1>
                <span>Tags</span>
                <span style={{ float: "right" }}>{upload.data.created_at}</span>
              </Segment>
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment>
                {/*<UserCard*/}
                  {/*page={this.props.page}*/}
                  {/*publisher={upload.data.publisher}*/}
                {/*/>*/}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                {/*<Comments />*/}
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      </Container>
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
  { getUploadOnce }
)(Upload);
