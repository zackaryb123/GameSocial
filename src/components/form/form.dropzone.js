import React from 'react';
import {connect} from 'react-redux';
import DropZone from 'react-dropzone';
import _ from 'lodash';

class FormDropzone extends React.Component {
  render() {
    // Parents Props
    const {disabled, handleOnDrop, file, fileLabel, directions, fileType} = this.props;
    return (
      <section>
        <div className="dropzone" style={{textAlign: 'center' && '-webkit-center'}}>
          <DropZone
            name="file"
            accept={fileType}
            onDrop={handleOnDrop}
            disabled={disabled}
          >
            <h2>{fileLabel}</h2>
            <p>{directions}</p>
          </DropZone>
        </div>
        <aside>
          <ul>
            {
              !_.isEmpty(this.props.file) &&
              <li>{file.original_name} - {file.bytes} bytes</li>
            }
          </ul>
        </aside>
      </section>
    );
  }
}

export default connect()(FormDropzone);