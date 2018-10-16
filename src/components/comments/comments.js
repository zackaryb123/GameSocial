import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import { Segment, Form, Comment, Header, Input, Label, Button, Feed } from "semantic-ui-react";
import {reduxForm, reset, Field} from "redux-form";
import {Link} from 'react-router-dom';
import {addComment, getComments, getCommentsOnce, getCommentsPromise} from "../../actions/actions.comments";

var moment = require("moment");
moment().format();

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingComments: true,
      initState: false
    }
  }

  componentDidMount() {
    this.props.getCommentsOnce(this.props.upload.data.id);
  }


  onSubmit(values) {
    const {upload, auth} = this.props;
    this.props.addComment(auth.currentUser, upload.data.id, values);
    this.props.dispatch(reset('comments'));
    this.props.getCommentsOnce(upload.data.id)
  }

  handleChange = (e) => {
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    })
  };

  renderCommentList(comments) {
    if(!_.isEmpty(comments.data)) {
      return _.map(comments.data, comment => {
        return (
          <Comment key={comment.commentId + comment.uploadId}>
            <Comment.Avatar
              src={comment.publisher.avatar}/>
            <Comment.Content>
              <Comment.Author as={Link} to={`/profile/${comment.publisher.id}`}>{comment.publisher.username}
              </Comment.Author>
              <Comment.Metadata>
                <div>{moment(comment.created_at).format("MMM Do YY") === moment(Date.now()).format("MMM Do YY") ?
                  moment(comment.created_at).fromNow() : moment(comment.created_at).format("MMM Do YY, h:mm:ss a")}</div>
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
              {!_.isEmpty(comments.data) && this.renderCommentList(comments)}
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