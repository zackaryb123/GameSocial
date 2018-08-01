class NewUserObject {
  constructor(auth, user) {
    this.id = auth.uid;
    this.profile = {
      id: auth.uid,
      username: user.username,
      email: auth.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob || '',
    };
    this.like = [{id: 'default'}];
    this.following = [{id: 'default'}];
    this.followers = [{id: 'default'}];
    this.favorites = [{id: 'default'}];
    this.isAdmin = false;
  }
}

class NewVideoObj {
  constructor(values, file) {
    this.url = file.secure_url;
    this.caption = values.caption;
    this.publisher = values.publisher;
    this.created_at = file.created_at;
    this.format = file.format;
    this.type = file.resource_type;
    this.codec = file.format === 'video' ? file.video.codec: null;
    this.views = null;
    this.like = null;
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
   accountSubmitted, message, header, status) {
    this.openModal = isOpen;
    this.status = status;
    this.message = message;
    this.header = header;
    this.isLoading = isLoading;
    this.showMsg = showMsg;
    this.accountSubmitted = accountSubmitted;
  }
}

class PlaylistObject{
  constructor(upload, playlistName) {
    if(upload === null) {
      this.id = '';
      this.url = '';
      this.name = '';
      this.playlist = '';
    }else {
      this.id = upload.id;
      this.url = upload.url;
      this.name = upload.content.title;
      this.playlist = playlistName;
    }
  }
}

class FavoriteObject{
  constructor(upload){
    this.id = upload.id;
    this.publisher = upload.publisher;
    this.content = upload.content;
    this.url = upload.url;
    this.config = upload.config;
  }
}

class TrackedFavoriteObject{
  constructor(authId, publisherId){
    this.userId = authId;
    this.uploadId = publisherId;
  }
}


module.exports = { Modal, NewUserObject, NewVideoObj, PlaylistObject, FavoriteObject ,TrackedFavoriteObject };