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

    fetch('http://localhost:3000/aut/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: loginUser.value,
        password: loginPassword.value 
      })
    })
    .then(resposta => resposta.json())
    .then(dados => {
      if(dados.Erro){
        alert(`Erro: ${dados.Erro}`);
      } else {
        localStorage.setItem('vault_token', dados.token)
        localStorage.setItem('vault_user', dados.username)
      }
      
      window.location.href ='index.html';
      
    })
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