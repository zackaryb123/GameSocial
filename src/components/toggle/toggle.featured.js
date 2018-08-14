import React, {Component} from 'react';
import { Checkbox } from 'semantic-ui-react';
import {connect} from 'react-redux'
import {addFeatured, removeFeatured, getFeaturedOnce, getInitFeaturedState} from '../../actions/actions.featured'
import _ from "lodash";

export class FeaturedToggle extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: 'Featured Toggle'
    }
  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name, 'Did Mount ');
    this.mounted = true;
    const {upload, getInitFeaturedState} = this.props;

    getInitFeaturedState(upload.id)
      .then(exist => {if (this.mounted) {this.setState({ isFeatured: exist })}});

    // this.props.getFeaturedOnce()
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
    const {featured, upload} = this.props;
    if (nextProps.featured.data !== featured.data){
      this.setState({ isFeatured: nextProps.featured.data && (upload.id in nextProps.featured.data) })
    }else{console.log('Component Up to date!')}
  }

  componentWillUnmount(){
    this.mounted = false;
  }

  handleToggle = () => {
    console.log('toggle success');
    const { isFeatured } = this.state;
    const {upload} = this.props;

    if (isFeatured) {this.props.removeFeatured(upload.id)}
    else{this.props.addFeatured(upload)}
    this.props.getFeaturedOnce()
  };

  render(){
    const {isFeatured} = this.state;
    const {auth} = this.props;

    return (
      auth.currentUser && auth.currentUser.isAdmin &&
        <span>
          <Checkbox style={{verticalAlign: 'middle'}} toggle checked={isFeatured} onClick={this.handleToggle}/>
          <span style={{marginLeft: '.5rem', fontSize: '12px'}}>Featured</span>
        </span>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  featured: state.featured
});

export default connect(mapStateToProps,
  {addFeatured, removeFeatured, getFeaturedOnce, getInitFeaturedState})
(FeaturedToggle)