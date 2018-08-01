import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Player } from 'video-react';
import _ from 'lodash';

import {Grid, Container, Segment} from 'semantic-ui-react';

import {deleteUpload} from "./../actions/actions.user.services";

import Comments from '../components/comments/comments';
import UserCard from '../components/card/card.user';
import ViewsCount from '../components/count/count.views';
import FavoriteToggle from '../components/toggle/toggle.favorite';
import LikesToggle from '../components/toggle/toggle.like';
import FeaturedToggle from '../components/toggle/toggle.featured';
import PlaylistToggle from '../components/toggle/toggle.playlist';

class View extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const {view, auth} = this.props;
    return (
      <Container>
        <Grid textAlign='center' style={{backgroundColor: 'black'}}>
          <Grid.Row className="row">
            <Grid.Column width={15}>
              <Player className="embed-responsive-item" loop playsinline aspectRatio="16:9" poster={view.data.thumbnail.large} src={view.data.url}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid centered>
          <Grid.Row>
            <Grid.Column width={15}>
              <Segment.Group>
                <Segment.Group horizontal>
                  <Segment><LikesToggle upload={view.data}/></Segment>
                  <Segment><ViewsCount uploadId={view.data.id} type={view.data.config.type}/></Segment>
                  <Segment>
                    <FavoriteToggle upload={view.data}/>
                    {
                      auth.currentUser && auth.currentUser.isAdmin &&
                      <div>
                        <span style={{float: 'left'}}>Featured</span>
                        <FeaturedToggle upload={view.data}/>
                      </div>
                    }
                  </Segment>
                </Segment.Group>
              </Segment.Group>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid stackable stretched centered>
          <Grid.Row>
            <Grid.Column width={10}>
              <Segment>
                <h1>{view.data.content.title}</h1>
                <p>{view.data.content.caption}</p>
                <span>Tags</span><span style={{float: 'right'}}>{view.data.content.createdAt}</span>
              </Segment>
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment><UserCard page={this.props.page} publisher={view.data.publisher}/></Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment>
                <Comments/>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  view: state.view,
  auth: state.auth
});

export default connect(mapStateToProps, {deleteUpload})(View);