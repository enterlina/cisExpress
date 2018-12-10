import keyboard from './utils/keyboard.js';
import backendAPI from './backendAPI.js';
import EmailInput from './components/EmailInput.js';
import PasswordInput from './components/PasswordInput.js';
import router from './router.js';
import userData from './utils/userData.js';

const loginPage = (function () {
  'use strict';

  const FORGOT_PASSWORD_HEADER = 'Forgot Password';
  const REGULAR_HEADER = 'Sign In CompBio';
  const FORGOT_PASSWORD_SIGN_IN_CAPTION = 'Send';
  const REGULAR_SIGN_IN_CAPTION = 'Sign In';

  class LoginPage {
    constructor () {
      this._model = {
        header: '',
        signInCaption: '',
        forgotPasswordActive: false,
        signInInProgress: false
      };
      this.emailComponent = undefined;
      this.passwordComponent = undefined;
      this.handleForgotPassword = this._handleForgotPassword.bind(this);
      this.handleSignIn = this._handleSignIn.bind(this);
      this.handleKeypress = this._handleKeypress.bind(this);
      window.onload = () => this.init();
    }

    init () {
      router.init();
      this.emailComponent = new EmailInput();
      this.passwordComponent = new PasswordInput();
      this.bindEventListeners();
    }

    get signInInProgress () {
      return this._model.signInInProgress;
    }

    set signInInProgress (v) {
      this._model.signInInProgress = v;
      if (v === true) {
        document.querySelector('.js-sign-in-btn').classList.add('in-progress');
      } else {
        document.querySelector('.js-sign-in-btn').classList.remove('in-progress');
      }
    }

    get signInCaption () {
      return this._model.signInCaption;
    }

    set signInCaption (v) {
      this._model.signInCaption = v;
      document.querySelector('.js-sign-in-btn').textContent = v;
    }

    get forgotPasswordActive () {
      return this._model.forgotPasswordActive;
    }

    set forgotPasswordActive (v) {
      this._model.forgotPasswordActive = v;
      if (v === true) {
        this.header = FORGOT_PASSWORD_HEADER;
        this.signInCaption = FORGOT_PASSWORD_SIGN_IN_CAPTION;
        document.querySelector('.login-form-container').classList.add('login-form-container--forgot-password');
      } else {
        this.header = REGULAR_HEADER;
        this.signInCaption = REGULAR_SIGN_IN_CAPTION;
        document.querySelector('.login-form-container').classList.remove('login-form-container--forgot-password');
      }
    }

    get header () {
      return this._model.header;
    }

    set header (v) {
      this._model.header = v;
      document.querySelector('.login-form-container__header').textContent = v;;
    }

    _handleForgotPassword (e) {
      this.forgotPasswordActive = true;
    }

    _handleSignIn () {
      if (this._model.signInInProgress) {
        return;
      }
      if (this._model.forgotPasswordActive) {
        backendAPI.requestResetPassword(this.emailComponent.val);
      } else {
        backendAPI.auth(this.emailComponent.val, this.passwordComponent.val)
        .then(jsonResp => {
          console.log(jsonResp);
          if (jsonResp.token !== undefined) {
            backendAPI.saveTokenToStorage(jsonResp.token);
            userData.save(jsonResp.user);
            router.setPagePath('LOGIN', location.pathname);
            router.savePageObjectToStorage();
            router.navigate(router.pages.PROJECTS);
          }
        });
      }
      this._model.signInInProgress = true;
    }

    _handleKeypress (e) {
      if (e.which === keyboard.KEYS.ENTER) {
        this.handleSignIn();
      }
    }

    bindEventListeners () {
      document.querySelector('.js-forgot-password-btn').addEventListener('click', this.handleForgotPassword);
      document.querySelector('.js-sign-in-btn').addEventListener('click', this.handleSignIn);
      document.querySelector('.js-login-form').addEventListener('keypress', this.handleKeypress);
    }
  }

  return new LoginPage();
})();

export default loginPage;
