import * as firebase  from 'firebase';

export const deleteUpload = (uploadId, type) => dispatch => {
  // Remove From Uploads
  return firebase.database().ref('uploads/').child(`${type}/${uploadId}`).remove()
    .then(console.log('upload successfully deleted'))
    .catch(err => console.log(err));

  // Remove From User Uploads

  // Remove any other saved locations
};