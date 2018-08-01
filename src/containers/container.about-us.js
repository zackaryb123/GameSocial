import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Header, Segment} from 'semantic-ui-react'
// import _ from 'lodash';

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "About Us Container",
      status: 0
    };
    // console.log(this.state.name, "Constructor");
  }


  componentWillMount() {
    //Constructor equivalent (state updates)
    // console.log(this.state.name, "Will Mount");

  }

  componentDidMount() {
    //DOM Manipulation (side effects/state updates)(render occurs before)
    // console.log(this.state.name,"Did Mount");
  }

  componentWillReceiveProps(nextProps) {
    //Update state based on changed props (state updates)
    // console.log(this.state.name, "Will Receive Props", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Compare and determine if render needed (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState)
  }

  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  render() {
    // const {name, status} = this.state;
    return (
      <Segment>
        <Header>About Us</Header>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {})(AboutUs);