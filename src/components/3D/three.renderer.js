import React from "react";
import PropTypes from "prop-types";

const Three = require("three");

export default class Renderer extends React.Component {
  state = { width: 0, height: 0 };

  render() {
    const { style = {} } = this.props,
      { render, width, height } = this.state;

    return (
      <canvas ref={this.canvasDidMount} style={style}>
        {React.Children.map(this.props.children, child =>
          React.cloneElement(child, {
            ...child.props,
            renderer: { Renderer: render, width, height }
          })
        )}
      </canvas>
    );
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.ref);
    window.removeEventListener("resize", this.resize);
  }

  canvasDidMount = canvas => {
    window.renderer = this;
    if (!canvas) {
      return;
    }
    const renderer = (this.renderer = new Three.WebGLRenderer({ canvas }));
    renderer.setClearColor("#000000");
    this.setState({ renderer });
    this.canvas = canvas;
    window.addEventListener("resize", this.resize);
    this.resize();
    this.frame();
  };

  resize = () => {
    const { canvas, renderer: r } = this,
      {
        devicePixelRatio: dpr,
        innerWidth: width,
        innerHeight: height
      } = window;
    this.setState({ width, height });
    r.setPixelRatio(dpr);
    r.setSize(width, height);
  };

  raycaster = new Three.Raycaster();

  frame = () => {
    this.ref = null;
    const { scene, camera, renderer } = this;
    if (!scene || !camera || !renderer) {
      return;
    }
    renderer.render(scene, camera);
    this.ref = requestAnimationFrame(this.frame);
  };

  getChildContext() {
    return {
      setScene: scene => {
        console.log("setScene", scene);
        this.scene = scene;
        this.frame();
      },
      setCamera: camera => {
        console.log("setCamera", camera);
        this.camera = camera;
        this.frame();
      }
    };
  }
}

Renderer.childContextTypes = {
  setScene: PropTypes.func,
  setCamera: PropTypes.func
};
