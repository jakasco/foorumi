import React, {Component} from 'react';
import {
  login,
  tokenCheck,
  registerUser,
  checkIfUserNameExists,
  changeForm,
} from '../utils/MediaAPI';
import PropTypes from 'prop-types';
import {Button, TextField, Typography} from '@material-ui/core';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

class Login extends Component {
  state = {
    user: {
      username: '',
      password: '',
      email: '',
      full_name: '',
      repeatPassword: '',
    },
    isAvailable: false,
  };

  componentDidMount() {
    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      if (data.message) {
        console.log('No token found. No redirection needed.');
      } else {
        this.props.history.push('/home');
      }
    });
    ValidatorForm.addValidationRule('usernameAvailable', () => {
      this.checkUsername();
      return this.state.isAvailable;
    });

    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.user.password) {
        return false;
      }
      return true;
    });
  }

  checkUsername = () => {
    checkIfUserNameExists(this.state.user.username).then((response) => {
      this.setState({isAvailable : response.available});
    });
  };

  handleInputChange = (evt) => {
    const target = evt.target;
    const value = target.value;
    const name = target.name;
    //console.log(name, value);
    this.setState((prevState) => {
      return {
        user: {
          ...prevState.user,
          [name]: value,
        },
      };
    });
  };

  login = (evt) => {
    evt.persist();
    login(this.state.user.username, this.state.user.password).then((user) => {
      if (user.token) {
        this.props.setUser(user);
        this.props.history.push('/home');
      } else {
        window.alert(user.message);
      }
    });
  };

  register = (evt) => {
    evt.persist();
    registerUser(this.state.user.username, this.state.user.password,
        this.state.user.full_name, this.state.user.email).then((data) => {
      if (data.error) {
        window.alert(data.message + '\n' + data.error);
      } else {
        this.login(evt);
        window.alert(data.message + '\nLogging in...');
      }
    });
  };

  changeForm = (evt) => {
    evt.preventDefault();
    changeForm();
  };

  render() {
    return (
        <React.Fragment>
          <div id="logincontainer" style={{display: 'block'}}>
            <Typography variant="h2" gutterBottom>Login</Typography>
            <ValidatorForm
                onSubmit={this.login}
                onError={errors => console.log(errors)}>
              <TextField
                  label="Username"
                  name="username"
                  type="text"
                  value={this.state.user.username}
                  onChange={this.handleInputChange}/>
              <br/>
              <TextField
                  label="Password"
                  type="password"
                  name="password"
                  value={this.state.user.password}
                  onChange={this.handleInputChange}
              />
              <br/>
              <br/>
              <Button type="submit" variant="contained">Login</Button>

            </ValidatorForm>
          </div>
          <div id="regcontainer" style={{display: 'none'}}>
            <Typography variant="h2" gutterBottom>Register</Typography>
            <p id="errorText"></p>
            <ValidatorForm
                onSubmit={this.register}
                onError={errors => console.log(errors)}>
              <TextValidator
                  id="pwform"
                  label="Username"
                  type="text"
                  name="username"
                  validators={[
                    'required',
                    'minStringLength:3',
                    'usernameAvailable']}
                  errorMessages={[
                    'this field is required',
                    'username must be at least 3 letters long',
                    'username is not available']}
                  value={this.state.user.username}
                  onChange={this.handleInputChange}/>
              <br/>
              <TextValidator
                  type="password"
                  label="Password"
                  name="password"
                  validators={['required', 'minStringLength:5']}
                  errorMessages={[
                    'this field is required',
                    'password must be at least 5 letters long']}
                  value={this.state.user.password}
                  onChange={this.handleInputChange}/>
              <br/>
              <TextValidator
                  type="password"
                  label="Repeat password"
                  name="repeatPassword"
                  validators={['isPasswordMatch', 'required']}
                  errorMessages={[
                    'password mismatch', 'this field is required']}
                  value={this.state.user.repeatPassword}
                  onChange={this.handleInputChange}/>
              <br/>
              <TextValidator
                  type="text"
                  label="Full name"
                  name="full_name"
                  value={this.state.user.full_name}
                  onChange={this.handleInputChange}
              />
              <br/>
              <TextValidator
                  type="email"
                  label="Email"
                  name="email"
                  validators={['required', 'isEmail']}
                  errorMessages={[
                    'this field is required',
                    'email is not valid']}
                  value={this.state.user.email}
                  onChange={this.handleInputChange}
              />
              <br/>
              <br/>
              <Button type="submit" variant="contained">Register</Button>

            </ValidatorForm>
          </div>
          <br/>
          <Button id="changeButton" variant="contained"
                  onClick={this.changeForm}>New user? Register instead!</Button>
        </React.Fragment>
    );
  }
}

Login.propTypes = {
  setUser: PropTypes.func,
  history: PropTypes.object,
};

export default Login;