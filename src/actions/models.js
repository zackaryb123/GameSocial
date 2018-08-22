class FirebaseEnvObj {
  constructor(env){
    this.name = env.name;
    this.apiKey = env.apiKey;
    this.authDomain = env.authDomain;
    this.databaseURL = env.databaseURL;
    this.projectId = env.projectId;
    this.storageBucket = env.storageBucket;
    this.messagingSenderId = env.messagingSenderId;
  }
}

class CloudinaryEnvObj {
  constructor(env){
    this.name = env.cloud_name;
    this.Id = env.Id;
    this.avatarUrl = env.avatarUrl;
    this.videoUrl = env.videoUrl;
    this.imageUrl = env.imageUrl;
    this.sourceUrl = env.sourceUrl;
    this.apiUrl = env.apiUrl;
    this.Secret = env.Secret;
  }
}

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
    this.created_at = file.created_at;
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
    this.id = upload.id;
    this.url = upload.url;
    this.caption = upload.caption;
    this.playlist = playlistName;
    this.options = upload.options;
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


module.exports = { Modal, NewUserObject, NewVideoObj, PlaylistObject ,TrackedFavoritesObj, FeedItemObj };