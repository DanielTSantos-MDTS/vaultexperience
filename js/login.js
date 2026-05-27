const loginForm =
  document.getElementById('login-form');

const loginUser =
  document.getElementById('login-user');

const loginPassword =
  document.getElementById('login-password');

const loginSubmit =
  document.getElementById('login-submit');

const googleLogin =
  document.getElementById('google-login');

const createAccount =
  document.getElementById('create-account');

/*--- VALIDAR INPUTS ---*/

function validateInputs() {

  const userFilled =
    loginUser.value.trim() !== '';

  const passwordFilled =
    loginPassword.value.trim() !== '';

  loginSubmit.disabled =
    !(userFilled && passwordFilled);

}

loginUser.addEventListener(
  'input',
  validateInputs
);

loginPassword.addEventListener(
  'input',
  validateInputs
);

/*--- LOGIN NORMAL ---*/

loginForm.addEventListener(
  'submit',
  e => {

    e.preventDefault();

    localStorage.setItem(
      'vault_logged',
      'true'
    );

    localStorage.setItem(
      'vault_user',
      loginUser.value
    );

    window.location.href =
      'index.html';

  }
);

/*--- LOGIN GOOGLE ---*/

googleLogin.addEventListener(
  'click',
  () => {

    localStorage.setItem(
      'vault_logged',
      'true'
    );

    localStorage.setItem(
      'vault_user',
      'Mendell'
    );

    window.location.href =
      'index.html';

  }
);

createAccount.addEventListener(
  'click',
  () => {

    window.location.href =
      'register.html';

  }
);