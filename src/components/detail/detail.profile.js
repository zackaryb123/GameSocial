import React, { Component } from "react";
import { connect } from "react-redux";

import { Grid, Image, Button, Segment } from "semantic-ui-react";

// import ModalEditProfile from "../Modal/Modal.EditProfile";
// import ModalLinkAccounts from "../Modal/Modal.LinkAccounts";

import FollowToggle from "../toggle/toggle.following";
import { addFollowers, removeFollowers } from "../../actions/actions.followers";
import { addFollowing, removeFollowing } from "../../actions/actions.following";
import { getUserOnce } from "../../actions/actions.user";

export class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { user, auth } = this.props;
    return (
      <Grid stackable padded stretched>
        <Grid.Row centered>
          <Grid.Column mobile={16} computer={8} largeScreen={5} verticalAlign='middle' style={{ width: "250px", height: "250px" }}>
            <Segment basic textAlign={"center"}>
              <Image
                style={{ borderRadius: "9rem", width: "200px", height: "200px", display: "inline-block" }}
                src={'https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png'}
                alt="Placeholder"
              />
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} largeScreen={5} verticalAlign='middle'>
            <Segment basic>
              <Segment>
                <p>{user.data.profile.name}</p>
                <p>@{user.data.profile.username}</p>
                {/*<p>{user.data.profile.bio}</p>*/}
                <div>
                  <a type="email">{user.data.profile.email}</a>
                </div>
                {auth.currentUser.uid !== user.data.profile.id && <FollowToggle publisher={user.data.profile}/>}              </Segment>
                {/*<div>*/}
                  {/*{!_.isEmpty(auth.currentUser) && (*/}
                    {/*<Button.Group>*/}
                      {/*<ModalLinkAccounts />*/}
                      {/*<Button.Or />*/}
                      {/*<ModalEditProfile />*/}
                    {/*</Button.Group>*/}
                  {/*)}*/}
                {/*</div>*/}
            </Segment>
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} largeScreen={5} verticalAlign='middle'>
            <Segment basic>
              <Segment>
                <span>Points: {0}</span>
              </Segment>
              <Segment>
                <span>Followers: {_.size(user.data.followers)}</span>
              </Segment>
              <Segment>
                <span>Following: {_.size(user.data.following)}</span>
              </Segment>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(
  mapStateToProps,
  { addFollowing, removeFollowing, addFollowers, removeFollowers, getUserOnce }
)(ProfileDetail);
