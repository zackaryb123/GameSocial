import React from "react";
import PropTypes from "prop-types";

const Three = require("three");

export class Scene extends React.Component {
  scene = new Three.Scene();

  componentDidMount() {
    this.context.setScene(this.scene);
  }

  componentWillReceiveProps({ fog, renderer: { Renderer } }) {
    if (!Renderer) {
      return;
    }
    if (fog) {
      this.scene.for = fog;
      Renderer.setClearColor(this.scene.fog.color);
    }
  }

  componentWillUnmount() {
    this.context.setScene(null);
  }

  getChildContext() {
    return { Scene: this.scene };
  }

  render() {
    const { renderer } = this.props;

    return (
      <div>
        {React.Children.map(this.props.children, child => {
          Rect.cloneElement(child, {
            ...child.props,
            renderer
          });
        })}
      </div>
    );
  }
}

Scene.contextTypes = Renderer.childContextTypes;
Scene.childContextTypes = {
  Scene: PropTypes.object
};
