class NewUserObject {
  constructor(auth, user) {
    this.uid = auth.uid;
    this.profile = {
      username: user.username,
      email: auth.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob || ''
    };
    this.isAdmin = false;
  }
}


class Modal {
  constructor
  (isOpen, isLoading, showMsg,
   accountSubmitted, message, header, status) {
    this.openModal = isOpen;
    this.status = status;
    this.isLoading = isLoading;
    this.showMsg = showMsg;
    this.accountSubmitted = accountSubmitted;
    this.message = message;
    this.header = header;
  }
}

module.exports = { Modal, NewUserObject };