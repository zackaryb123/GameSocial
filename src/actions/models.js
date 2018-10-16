class NewUserObject {
  constructor(auth, user) {
    this.id = auth.uid;
    this.profile = {
      id: auth.uid,
      avatar: 'https://res.cloudinary.com/game-social/image/upload/v1535574015/Avatars/h5qobnfpoozt4ohlj2js.png',
      username: user.username,
      email: auth.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: `Hello my name is ${user.firstName} ${user.lastName}`,
      dob: user.dob || '',
    };
    this.feed = null;
    this.following = null;
    this.followers = null;
    this.favorites = null;
    this.isAdmin = false;
  }
}

class NewVideoObj {
  constructor(values, file) {
    this.url = file.secure_url;
    this.caption = values.caption;
    this.publisher = values.publisher;
    this.created_at = Date.now();
    this.format = file.format;
    this.type = file.resource_type;
    this.codec = file.format === 'video' ? file.video.codec: null;
    this.views = null;
    this.likes = null;
    this.status =  {
      enabled: true,
      featured: false,
      flagged: false
    };
    this.options = {
      autoPlay: true,
      looping_enabled: true,
    };
  }
}

class Modal {
  constructor
  (isOpen, isLoading, showMsg,
   accountSubmitted, message, header, status, videos) {
    this.openModal = isOpen;
    this.status = status;
    this.message = message;
    this.header = header;
    this.videos = videos;
    this.isLoading = isLoading;
    this.showMsg = showMsg;
    this.accountSubmitted = accountSubmitted;
  }
}

class XboxDvrObj {
  constructor(item) {
    this.name = item.name;
    this.downloadUrl = item['@microsoft.graph.downloadUrl'];
    this.webUrl = item.webUrl;
    this.id = item.id;
    this.createdDateTime = item.createdDateTime
  }
}

class PlaylistObject{
  constructor(upload, playlistName) {
    this.id = upload.id;
    this.url = upload.url;
    this.playlist = playlistName;
    this.options = upload.options;
    this.created_at = upload.created_at
  }
}

class FavoriteObject {
  constructor(upload) {
    this.id = upload.id;
    this.created_at = upload.created_at
  }
}


class TrackedFavoritesObj{
  constructor(authId, publisherId){
    this.userId = authId;
    this.uploadId = publisherId;
  }
}

class FeedItemObj{
  constructor(upload){
    this.id = upload.id;
    this.created_at = upload.created_at;
  }
}

class CommentObj{
  constructor(uploadId, commentId, publisher, values){
    this.comment = values.comment;
    this.commentId = commentId;
    this.uploadId = uploadId;
    this.created_at = Date.now();
    this.publisher = {
      id: publisher.uid
    }
  }
}

module.exports = { Modal, XboxDvrObj, CommentObj, NewUserObject, NewVideoObj, PlaylistObject ,TrackedFavoritesObj, FeedItemObj, FavoriteObject };