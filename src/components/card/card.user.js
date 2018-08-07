import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Image, Card, Button} from 'semantic-ui-react';

import FollowToggle from '../toggle/toggle.follow';

import {addFollowers, removeFollowers} from "../../actions/actions.followers";
import {addFollowing,removeFollowing} from "../../actions/actions.following";

class UserCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followers: null,
      following: null
    }
  }

  render() {
    const {publisher} = this.props;
    return (
      <Card>
        <Card.Content>
          {/*<Image style={{borderRadius: '.25rem'}} floated='right' size='mini' src={publisher.avatar.url} />*/}
          <Card.Header>
            {publisher.username}
          </Card.Header>
        </Card.Content>
        <Card.Content extra>
          <div className='ui two buttons'>
            {/*<FollowToggle publisher={publisher}/>*/}
            <Button
              color='blue'><Link to={`/profile/${publisher.id}`}>Profile</Link></Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
}


const mapStateToProps = state => ({
  user: state.user,
  auth: state.auth,
  followers: state.followers,
  following: state.following
});

export default connect(mapStateToProps,
  {addFollowing, addFollowers,
    removeFollowing, removeFollowers})
(UserCard);