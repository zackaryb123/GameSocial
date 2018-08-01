import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm, reset } from 'redux-form';
import {Message, Header, Input, Modal, Form, Button, Icon, Label} from 'semantic-ui-react';
import {uploadValidation} from '../form/form.validation';
import _ from "lodash";
import {getUserOnce} from "../../actions/actions.user";
import {openUploadModal, upload} from "../../actions/actions.modals";
import FormDropzone from "../form/form.dropzone";
import {CloudinaryConfig} from "../../dbConfig";
import axios from "axios";

class UploadModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file:[],
      fileSelected: false
    }
  }

  componentDidMount() {
    const {getUserOnce, auth} = this.props;
    getUserOnce(auth.currentUser.uid);
  }

  onSubmit(values) {
    const {fileSelected} = this.state;
    console.log(values);

    if(_.isEmpty(fileSelected)) {
     return this.props.openUploadModal('Oops!', 'Please select an image or video to upload.', 1, false)
    } else {
      values.publisher = this.props.user.data.profile;
      this.props.upload(values, fileSelected);
      this.props.dispatch(reset('upload'));
    }
  }

  onFileSelect(file) {
    const unsignedUploadPreset = CloudinaryConfig.cloud_name;
    const thisComponent = this;
    const fileSelected = file[0];

    console.log(fileSelected);

// Check video type
    const videoFileType = fileSelected.name.split('.').pop().toLowerCase();
    const hasVideoIndex = _.some(['mp4', 'webm', 'flv', 'mov', 'ogv', '3gp', '3g2', 'wmv', 'mpeg', 'flv', 'mkv', 'avi'], function (o) {
      return o === videoFileType;
    });

// Check image type
    const imageFileType = fileSelected.name.split('.').pop().toLowerCase();
    const hasImageIndex = _.some(['gif', 'webp', 'bmp', 'flif', 'ico', 'jpg', 'jpe', 'jpeg', 'jpc', 'jp2', 'j2k', 'wdp', 'jxr', 'hdp', 'png', 'psd', 'tga', 'tif', 'tiff'], function (o) {
      return o === imageFileType;
    });

// If correct file create form data and axios POST to cloudinary
    if (hasVideoIndex || hasImageIndex) {
      const data = new FormData();
      const timestamp = Date.now() / 1000;

      data.append('file', fileSelected);
      data.append('upload_preset', unsignedUploadPreset);
      data.append('api_key', CloudinaryConfig.apiKey);
      data.append('timestamp', timestamp);

      let config = {
        onUploadProgress: function (progressEvent) {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          thisComponent.setState({fileProgress: progress});
          if (progress === 100) {
            console.log('COMPLETE!');
            thisComponent.setState({fileStatus: 'Complete'});
          } else {
            thisComponent.setState({fileStatus: 'Uploading...'});
          }
        }
      };

// axios POST request to cloudinary
      const url = hasImageIndex ? CloudinaryConfig.imageUrl : CloudinaryConfig.videoUrl;
      axios.post(url, data, config)
        .then(res => {
          let fileError = {status: false, msg: ''};
          thisComponent.setState({videoError: fileError, fileSelected: res.data});
        }).catch(error => {
          let videoError = {status: true, msg: error.message + ': File size is likely too big.'};
          thisComponent.setState({videoError: videoError});
        })
    } else {
      let videoError = {
        status: true,
        msg: 'Unsupported file type: ' + videoFileType === false ? imageFileType : videoFileType
      };
      thisComponent.setState({videoError: videoError});
    }
  };

  handleOnDrop = (files) =>{
    this.setState({files, disabled: files.length === 1, fileIsSelected: true});
    this.onFileSelect(files);
  };

  handleChange = (e) => this.setState({[e.target.name]: e.target.value});

  closeResetModal(){
    this.props.dispatch(reset('upload'));
    this.props.closeModal();
  }

  renderFields(field){
    return(
      <Form.Field required>
        <Input {...field.input} {...field.error }  fluid={field.fluid} type={field.type} placeholder={field.placeholder} />
        {field.meta.touched && (field.meta.error && <Label pointing color='red'> {field.meta.error} </Label>)}
      </Form.Field>
    )
  }

  render() {
    const { handleSubmit, uploadModal } = this.props;

    return (
      <Modal open={this.props.openModal} closeIcon='close' onClose={this.closeResetModal.bind(this)} closeOnDocumentClick={true} closeOnDimmerClick={false} basic size='small'>

        <Header icon='upload' content='Upload Image or Video'/>

        <Modal.Content>
          {uploadModal.message && uploadModal.status === 0 && <Message positive><Message.Header>{uploadModal.header}</Message.Header><p>{uploadModal.message}</p></Message>}
          {uploadModal.message && uploadModal.status === 1 && <Message negative><Message.Header>{uploadModal.header}</Message.Header><p>{uploadModal.message}</p></Message>}
          <Form inverted={true} onSubmit={handleSubmit(this.onSubmit.bind(this))}>
            <FormDropzone file={this.state.file} fileLabel="File" fileType={''} handleOnDrop={this.handleOnDrop.bind(this)} disabled={this.state.disabled} directions="Drop or click to upload a video or image file."/>
            <Field onChange={this.handleChange} fluid name="caption" type="text" placeholder="Enter Caption" component={this.renderFields}/>
            <Button
              disabled={this.props.pristine || this.props.submitting || _.isEmpty(this.state.fileSelected) || !this.state.fileIsSelected}
              type='submit' basic color='green' inverted><Icon name='upload'/>Upload</Button>
          </Form>
        </Modal.Content>

      </Modal>
    )
  }
}

const UploadForm = reduxForm({
  form: 'upload',
  validate: uploadValidation
})(
  connect(mapStateToProps,{openUploadModal,getUserOnce, upload})(UploadModal)
);

function mapStateToProps(state){
  return {
    auth: state.auth,
    user: state.user,
    uploadModal: state.uploadModal
  };
}

export default UploadForm;