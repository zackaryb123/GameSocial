import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import { Segment, Form, Comment, Header, Input, Label, Button } from "semantic-ui-react";
import {reduxForm, reset, Field} from "redux-form";
import {Link} from 'react-router-dom';
import {addComment, getComments, getCommentsOnce, getCommentsPromise} from "../../actions/actions.comments";

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingComments: true,
      initState: false
    }
  }
  componentWillMount() {
    //this.props.getCommentsOnce(upload.data.id)
  }

  componentDidMount() {
    // TODO: Decide weather to user on or once call and load comments on submit/refresh
    this.props.getComments(this.props.upload.data.id);
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

  onSubmit(values) {
    const {upload, auth} = this.props;
    this.props.addComment(auth.currentUser, upload.data.id, values);
    this.props.dispatch(reset('comments'));
    // this.props.getCommentsOnce(upload.data.id)
  }

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  renderCommentList() {
    const {comments} = this.props;

    return _.map(comments.data, comment => {
      // let infoArray = Object.values(comment);
      // console.log(infoArray);

      return (
        <Comment key={comment.commentId + comment.uploadId}>
          <Comment.Avatar src='https://res.cloudinary.com/game-social/image/upload/v1529600986/Avatars/do3vsmak5q0uvsotseed.png' />
          <Comment.Content>
            <Comment.Author as={Link} to={`/profile/${comment.profile.id}`}>{comment.username}
            </Comment.Author>
            <Comment.Metadata>
              <div>Today at 5:42PM</div>
            </Comment.Metadata>
            <Comment.Text>{comment.comment}
            </Comment.Text>
            <Comment.Actions>
              <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      )
    })
  }

  renderFields(field) {
    return (
      <Form.Field required>
        <Input {...field.input} {...field.error} fluid={field.fluid} type={field.type} placeholder={field.placeholder}/>
        {field.meta.touched && (field.meta.error && <Label pointing color='red'> {field.meta.error} </Label>)}
      </Form.Field>
    )
  }

  render() {
    const {comments} = this.props;

    console.log(this.renderCommentList());
    return(
      <Segment>
        <Form onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>
          <Field onChange={this.handleChange}  fluid name="comment" type="text" placeholder="Post a comment" component={this.renderFields}/>
          <Button disabled={this.props.pristine || this.props.submitting}  type='submit' basic color='green'>Submit</Button>
        </Form>
        <div>
          <Comment.Group>
            <Header as={'h3'} dividing>
              Comments
            </Header>
              {this.renderCommentList()}
          </Comment.Group>
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  comments: state.comments,
  upload: state.upload
});

Comments = connect(mapStateToProps,
  {getComments, getCommentsOnce, getCommentsPromise, addComment})
(Comments);

export default reduxForm({
  form: 'comments',
})(Comments);