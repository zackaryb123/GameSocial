import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Container, Header, Segment} from 'semantic-ui-react'
import RequiresLogin from '../components/hoc/requires.auth';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Home Container"
    };
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
    // Re-render if prev/current props !equal and data requested is !empty (DO NOT CHANGE STATE)
    // console.log("Should", this.state.name, "Update", nextProps, nextState);
    return true
  }

  componentWillUpdate(nextProps, nextState) {
    // Set or reset cached values before next render (DO NOT CHANGE STATE)
    // console.log(this.state.name ,"Will Update", nextProps, nextState);
  }

  componentDidUpdate(prevProps, prevState) {
    //DOM Manipulation (render occurs before)
    // console.log(this.state.name, "Did Update", prevProps, prevState);
  }


  componentWillUnmount(){
    //DOM Manipulation (side effects)
    // console.log(this.state.name, "Will Unmount");
  }

  render() {
    const {feed} = this.props;

    return (
      <Container>
        <Segment>
          <Header>Home Landing Page</Header>
        </Segment>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  feed: state.feed,
  following: state.following,
  likes: state.likes
});

export default (connect(mapStateToProps, {})(Home));
