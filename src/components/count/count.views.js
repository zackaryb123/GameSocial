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
      ipAddress: null,
      hasViewed: null
    };
  }

  componentWillMount() {
    //Constructor equivalent (state updates)
    console.log(this.state.name, "Will Mount");

    // Initialize IP address in the state
    // publicIp.v4().then(ip => {
    //   console.log(ip);
    //   let ipString = ip.split(".").join("-");
    //   this.setState({ipAddress: ipString});
    // });
  }

  componentDidMount(){
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    publicIp.v4().then(ip => {
      console.log(ip);
      let ipString = ip.split(".").join("-");
      this.setState({ipAddress: ipString});
      this.props.checkUploadViewsList(ipString, this.props.upload.id)
        .then(hasViewed => {
          this.setState({hasViewed: hasViewed});
          if(!hasViewed){this.incrementViews()
          }else{this.props.getCountViewsOnce(this.props.upload.id);}
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    console.log(this.state.name, "Will Receive Props", nextProps);

    // const {upload} = this.props;
    // On like props received set the liked boolean
    // if(nextProps.upload.views !== upload.views) {this.setState({reCount: true})}
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    console.log("Should", this.state.name, "Update", nextProps, nextState);

    // if(this.state.reCount && (nextProps.upload.views !== this.props.upload.views)) {return true}
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    console.log(this.state.name ,"Will Update", nextProps, nextState);

  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    console.log(this.state.name, "Did Update", prevProps, prevState)

  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  incrementViews(){
    const {ipAddress} = this.state;
    const {upload} = this.props;
    this.props.addCountViews(ipAddress, upload);
    this.props.getCountViewsOnce(upload.id);
  }

  render() {
    console.log('Render');
    const {auth, viewsCount, upload} = this.props;
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