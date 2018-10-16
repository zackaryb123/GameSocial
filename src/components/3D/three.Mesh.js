import React from "react";
import PropTypes from "prop-types";

const Three = require("three");

const ComponentFor = MeshClass => {
  class Mesh extends React.Component {
    componentDidMount() {
      this.updateMesh(this.props);
    }

    componentWillReceiveProps(props) {
      this.updateMeash(props);
    }

    componentWillUnmount() {
      this.content.Scene.remove(this.mesh);
    }
    updateMesh(props) {
      if (!this.mesh) {
        console.log("constructing new", MeshClass);
        this.mesh = new MeshClass();
        this.context.Scene.add(this.mesh);
      }

      for (let p of Object.keys(props)) {
        if (this.mesh[p] && this.mesh[p].set) {
          this.mesh[p].set(...props[p]);
        } else {
          this.mesh[p] = props[p];
        }
      }

      if (this.mesh.updateMatrix) {
        this.mesh.updateMatrix();
        this.mesh.matrixAutoUpdate = false;
      }
    }
    render() {
      return <div>{this.props.children}</div>;
    }
  }
  Mesh.contextTypes = Scene.childContextTypes;
  Mesh.displayName = MeshClass.name;
  return Mesh;
};

export const Mesh = ComponentFor(Three.Mesh);
export const DirectionalLight = ComponentFor(Three.DirectionalLight);
export const AmbientLight = ComponentFor(Three.AmbientLight);
