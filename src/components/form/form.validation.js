export default function validate(value){
  const errors = {};

  if(!value.username || (value.username === "")){
    errors.username = "User Name Required";
  } else if (value.username.length < 4){
    errors.username = 'Must be 3 characters or more.';
  } else if(value.username && value.username.split(' ').length > 1){
    errors.username = 'No spaces allowed';
  }

  if(!value.firstName || (value.firstName === "")){
    errors.firstName = "First Name Required";
  }

  if(!value.lastName || (value.lastName === "")){
    errors.lastNamae = "Last Name Required";
  }

  if(!value.email || (value.email === "")){
    errors.email = "Email Required";
  }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email)) {
    errors.email = 'Invalid email address';
  }

  if(!value.password){
    errors.password = "Password Required";
  } else if (value.password.length < 6){
    errors.password = 'Must be 6 characters or more.';
  }

  if(!value.terms){
    errors.terms = "You must agree to the terms";
  } else if (value.terms === false){
    errors.password = 'You must agree to the terms';
  }

  if(!value.month){
    errors.month = "Month Required";
  }

  if(!value.day){
    errors.day = "Day Required";
  }

  if(!value.year){
    errors.year = "Year Required";
  } else if (value.year.length < 4 || value.year.length > 4  ){
    errors.year = '4 Digit Year Required';
  }
  //If error
  return errors;
}

export function forgotPasswordValidate(value){
  const errors = {};
  console.log('forgotPasswordValidate');

  if(!value.email || (value.email === "")){
    errors.email = "Email Required";
  }else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value.email)) {
    errors.email = 'Invalid email address';
  }
  //If error
  return errors;
}

export function resetPasswordValidate(value){
  const errors = {};
  console.log('resetPasswordValidate');

  if(!value.password1){
    errors.password1 = "Password Required";
  } else if (value.password1.length < 6){
    errors.password1 = 'Must be 6 characters or more.';
  }

  if(!value.password2){
    errors.password2 = "Confirm Password Required";
  } else if (value.password2.length < 6){
    errors.password2 = 'Must be 6 characters or more.';
  }

  if(value.password2 && (value.password1 !== value.password2)){
    errors.password2 = "Passwords Must Match";
  }

  //If error
  return errors;
}


export function uploadValidation(value){
  const errors = {};
  console.log('uploadValidation');

  console.log(value);

  if(!value.caption){
    errors.caption = "Caption Required";
  }

  return errors;
}