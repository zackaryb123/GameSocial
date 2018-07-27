import React, { Component } from 'react';
import {connect} from 'react-redux';
// import _ from 'lodash';

class MobileBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'MobileBar'
    };
    console.log(this.state.name, "Constructor");
  }

  componentWillMount() {
    console.log(this.state.name, "Will Mount");
  }

  componentDidMount() {
    console.log(this.state.name,"Did Mount");
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.state.name, "Will Receive Props", nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("Should", this.state.name, "Update", nextProps, nextState);
    return true;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state.name, "Did Update", prevProps, prevState)
  }

  componentWillUnmount(){
    console.log(this.state.name, "Will Unmount");
  }

  render() {
    return (
      <div>
        {this.state.name && <p>Name: {this.state.name}</p>}
      </div>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {})(MobileBar);
