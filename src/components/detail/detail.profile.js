import React, { Component } from "react";
import { connect } from "react-redux";
import { Grid, Image, Table, Segment, Feed, Icon } from "semantic-ui-react";
import axios from 'axios';

import FollowToggle from "../toggle/toggle.following";
import { addFollowers, removeFollowers } from "../../actions/actions.followers";
import { addFollowing, removeFollowing } from "../../actions/actions.following";
import { getUserOnce } from "../../actions/actions.user";
import {editAvatar} from '../../actions/actions.user.edits';
import {openLinksModal, openOneDriveModal} from "../../actions/actions.modals";
// import {CloudinaryConfig} from "../../dbConfig";
const CloudinaryConfig = require('CloudinaryConfig');
import _ from "lodash";

export class ProfileDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.fileUploader = React.createRef();
  }

  openEditProfileModal = () => {

  };

  openPlaystationModal = () => {
    console.log('Playstation Modal open')
  };

  openOneDriveModal = () => {
    this.props.openOneDriveModal(null, null, null, this.props.auth.xboxVideos);
  };

  openLinksModal = () => {
    this.props.openLinksModal();
  };

  openEditAvatarModal = () => {
    this.fileUploader.current.click();
  };

  onChangeFile(event) {
    event.stopPropagation();
    event.preventDefault();
    let file = event.target.files[0];
    console.log(file);
    this.onFileSelect(file);
  }

  onFileSelect(file) {
    const unsignedUploadPreset = CloudinaryConfig.avatarPreset;
    const {auth} = this.props;
    const thisComponent = this;

    // Check image type
    const imageFileType = file.name.split('.').pop().toLowerCase();
    const hasImageIndex = _.some(['gif', 'webp', 'bmp', 'flif', 'ico', 'jpg', 'jpe', 'jpeg', 'jpc', 'jp2', 'j2k', 'wdp', 'jxr', 'hdp', 'png', 'psd', 'tga', 'tif', 'tiff'], function (o) {
      return o === imageFileType;
    });

    // If correct file create form data and axios POST to cloudinary
    if (hasImageIndex) {
      const data = new FormData();
      const timestamp = Date.now()/1000;

      data.append('file', file);
      data.append('upload_preset', unsignedUploadPreset);
      data.append('api_key', CloudinaryConfig.apiKey);
      data.append('timestamp', timestamp);

      let config = {
        // headers: { "X-Requested-With": "XMLHttpRequest" },
        onUploadProgress: function (progressEvent) {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          thisComponent.setState({fileProgress: progress});
          if (progress === 100) {
            console.log('COMPLETE!');
            thisComponent.setState({fileStatus: 'Complete'});
          } else {
            thisComponent.setState({fileStatus: 'Uploading...'});
          }
        }
      };

      const url = CloudinaryConfig.imageUrl;
      axios.post(url, data, config)
        .then(res => {
          // get User is w/in the editAvatar function
          this.props.editAvatar(auth.currentUser.uid, res.data);
        })
        .catch(error => {
          let videoError = { status: true, msg: error.message + ': File size is likely too big.' };
          thisComponent.setState({videoError: videoError});
        })
    } else {
      let videoError = {
        status: true,
        msg: 'Unsupported file type: ' + imageFileType
      };
      thisComponent.setState({videoError: videoError});
    }
  };


  render() {
    const { user, auth } = this.props;

    if(_.isEmpty(auth.currentUser)){return null}

    return (
      <Grid stackable padded>
        <Grid.Row verticalAlign='middle' centered>
          <Grid.Column textAlign='center' mobile={16} computer={8} largeScreen={5}>
            <Segment basic style={{display: 'inline-block'}}>
            {auth.currentUser.uid === user.data.id &&
            <Feed style={editAvatarCss}><Feed.Event><Feed.Content><Feed.Meta><Feed.Like>
              <Icon inverted size='large' corner onClick={this.openEditAvatarModal} name={'edit outline'}/>
              <input type="file" id="file" ref={this.fileUploader} style={{display: "none"}} onChange={this.onChangeFile.bind(this)}/>
            </Feed.Like></Feed.Meta></Feed.Content></Feed.Event></Feed>}
            <Image
              style={avatarCss}
              src={user.data.profile.avatar}
              alt="Placeholder"/>
            </Segment>
          </Grid.Column>
          <Grid.Column verticalAlign='middle' textAlign='center' mobile={16} computer={8} largeScreen={5}>
            <Segment>
              {auth.currentUser.uid === user.data.id &&
              <Feed><Feed.Event><Feed.Content>
                <Feed.Meta style={editProfileCss}>
                  <Feed.Like><Icon size='large' corner onClick={this.openEditProfileModal} name={'edit outline'}/></Feed.Like>
                </Feed.Meta>
              </Feed.Content></Feed.Event></Feed>}
              <p>{user.data.profile.name}</p>
              <p>@{user.data.profile.username}</p>
              <p><a type="email">{user.data.profile.email}</a></p>
              <p>{user.data.profile.bio}</p>
              {auth.currentUser.uid !== user.data.profile.id &&
              <Feed><Feed.Event><Feed.Content>
                <Feed.Meta style={editProfileCss}>
                  <Feed.Like><FollowToggle onClick={this.openEditAvatarModal} publisher={user.data.profile}/></Feed.Like>
                </Feed.Meta></Feed.Content></Feed.Event></Feed>}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row centered>
          <Grid.Column style={{marginBottom: '1rem'}} mobile={16} computer={8} largeScreen={5}>
            {auth.currentUser.uid === user.data.id &&
            <Table unstackable size='small'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>
                    {auth.currentUser.uid === user.data.id &&
                    <Feed style={{display: 'inline-block'}}><Feed.Event><Feed.Content>
                      <Feed.Meta>
                        <Feed.Like><Icon size='large' corner onClick={this.openLinksModal} name={'linkify'}/></Feed.Like>
                      </Feed.Meta>
                    </Feed.Content></Feed.Event></Feed>
                    }Account
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign='right'>Linked</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell selectable><a style={{cursor: 'pointer'}} onClick={this.openOneDriveModal}>Xbox DVR</a></Table.Cell>
                  <Table.Cell textAlign='right'>{auth.xboxFileId && <Icon color='green' name='checkmark' size='large'/>}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell selectable><a style={{cursor: 'pointer'}} onClick={this.openPlaystationModal}>Playstation DVR</a></Table.Cell>
                  <Table.Cell textAlign='right'>Coming Soon!{auth.facebook && <Icon color='green' name='checkmark' size='large' />}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell selectable><a style={{cursor: 'pointer'}} onClick={this.openPlaystationModal}>Nintendo DVR</a></Table.Cell>
                  <Table.Cell textAlign='right'>Coming Soon!</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>}
          </Grid.Column>
          <Grid.Column mobile={16} computer={8} largeScreen={5} verticalAlign='middle'>
            <Table unstackable size='small'>
              <Table.Body>
                <Table.Row>
                  <Table.Cell><a onClick={this.openOneDriveModal}>Points:</a></Table.Cell>
                  <Table.Cell textAlign='right'>0</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><a onClick={this.openPlaystationModal}>Followers</a></Table.Cell>
                  <Table.Cell textAlign='right'>{_.size(user.data.followers)}</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell><a onClick={this.openPlaystationModal}>Following</a></Table.Cell>
                  <Table.Cell textAlign='right'>{_.size(user.data.following)}</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
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
  { addFollowing, removeFollowing, addFollowers, removeFollowers, getUserOnce, editAvatar, openLinksModal, openOneDriveModal }
)(ProfileDetail);

const editProfileCss = {
  position: 'absolute',
  top: '0',
  right: '0'
};

const editAvatarCss = {
  position: 'absolute'
};

const avatarCss = {
  borderRadius: '5rem',
  display: 'inline-block',
  width: '300px'
};