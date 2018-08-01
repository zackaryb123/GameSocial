import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as firebase from "firebase";
import { Icon, Button } from 'semantic-ui-react';
const publicIp = require('public-ip');

import {checkUploadViewsList, addCountViews, getCountViews} from "../../actions/actions.count.views";

//TODO: Need to pass type and uploadId from parent
class ViewsCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ipAddress: null,
      hasViewed: null
    };
  }

  componentDidMount(){
    publicIp.v4().then(ip => {
      console.log(ip);
      let ipString = ip.split(".").join("-");
      this.setState({ipAddress: ipString});
      this.checkUploadViewList();
    });
  }

  checkUploadViewList(){
    const {ipAddress} = this.state;
    const {uploadId, type} = this.props;
    if(type === 'image') {
      database.ref(`uploads/images/${uploadId}/views/${ipAddress}`)
        .once('value', data => {
          let hasViewed = !!data.val();
          if(!hasViewed){
            this.incrementViews()
          }else{
            this.props.getCountViews(uploadId, type);
          }
        });
    }

    if(type === 'video'){
      database.ref(`uploads/videos/${uploadId}/views/${ipAddress}`)
        .once('value', data => {
          let hasViewed = !!data.val();
          if(!hasViewed){
            this.incrementViews()
          }else {
            this.props.getCountViews(uploadId, type);
          }
        })
    }
  }

  incrementViews(){
    const {ipAddress} = this.state;
    const {uploadId, type} = this.props;
    this.props.addCountViews(ipAddress, uploadId, type);
    this.props.getCountViews(uploadId, type);
  }

  setCount(val){
    let usersRef = firebase.database().ref("users/"+this.props.userId+"/following");
    if(val){
      usersRef.child(this.props.publisherId).set(val);
    }else{
      usersRef.child(this.props.publisherId).remove();
    }
  }

  render() {
    return (
      <div>
        Views: {this.props.countViews.data}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  countViews: state.countViews
});

export default connect (mapStateToProps,
  {checkUploadViewsList, addCountViews, getCountViews})
(ViewsCount);