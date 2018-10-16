import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Container, Header, Segment } from "semantic-ui-react";
import DemoScene from "../components/3D/3d.avatar";

class AboutUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "About Us Container",
      status: 0
    };
    // console.log(this.state.name, "Constructor");
  }

  render() {
    // const {name, status} = this.state;
    return (
      <Container>
        <Segment>
          <Header>About Us</Header>
        </Segment>
        {/*<DemoScene/>*/}
      </Container>
    );
  }
}

const mapStateToProps = state => ({

});

export default connect(mapStateToProps,
  {})(AboutUs);