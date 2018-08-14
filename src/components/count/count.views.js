import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon, Button } from 'semantic-ui-react';
import {checkUploadViewsList, addCountViews, getCountViewsOnce} from "../../actions/actions.count.views";
import _ from 'lodash';

const publicIp = require('public-ip');

class ViewsCount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'View Count',
      ipAddress: null,
      hasViewed: null
    };
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    this.mounted = true;
    publicIp.v4().then(ip => {
      console.log(ip);
      let ipString = ip.split(".").join("-");
      if(this.mounted){this.setState({ipAddress: ipString});}
      this.props.checkUploadViewsList(ipString, this.props.upload.id)
        .then(hasViewed => {
          if(this.mounted) {this.setState({ hasViewed: hasViewed });}
          if(!hasViewed){this.incrementViews()
          }else{this.props.getCountViewsOnce(this.props.upload.id);}
        });
    });
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
    this.mounted = false;
  }

  incrementViews(){
    const {ipAddress} = this.state;
    const {upload} = this.props;
    this.props.addCountViews(ipAddress, upload);
    this.props.getCountViewsOnce(upload.id);
  }

  render() {
    const {auth, upload} = this.props;
    return (
      auth.currentUser &&
      <span>
        <Icon inverted name={'eye'}/><span style={cWhite}>{_.size(upload.views)}</span>
      </span>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  viewsCount: state.viewsCount
});

export default connect (mapStateToProps,
  {checkUploadViewsList, addCountViews, getCountViewsOnce})
(ViewsCount);

const cWhite = {
  color: 'white'
};