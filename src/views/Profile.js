import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Redirect, Route} from 'react-router-dom';
import Nav from "../App";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {  Grid, Button, TextField,} from '@material-ui/core';
import {
    changeUserPassword,
    changeUserName,
    changeUserEmail,
    getFilesWithTag
} from '../utils/MediaAPI';

class Profile extends Component {

    state = {
        user: {
            username: '',
            password: '',
            email: '',
            full_name: '',
        },
        oldPassword: '',
        newPassword: '',
        newPasswordRepeat: '',
        newEmail: '',
        newUserName: '',
    };

    componentDidMount() {

        console.log("Propseissa tuleva password:",this.props.password+" tai localStoragessa: "+localStorage.getItem('Pw'));
        // korjataan profiilisivun latausongelma
        if(this.props.user === null) {
            return <Redirect to="/"/>;
        }else{
          this.state.user = this.props.user;
          console.log("User profiilissa: ",this.state.user);
        }


    };


    handleInputChangeOldPw = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;
        this.setState({oldPassword: value});

        this.setState((prevState) => {
            return {
                ...prevState.oldPassword,
                [name]: value,
            }
        });
    };

    handleInputChangeNewPw = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;
        console.log("New: ",name, value);
        this.setState({newPassword: value});
        this.setState((prevState) => {
            return {
                ...prevState.newPassword,
                [name]: value,
            }
        });
    };

    handleInputChangeEmail = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;
        console.log("New email: ",name, value);
        this.setState({newEmail: value});
        this.setState((prevState) => {
            return {
                ...prevState.newEmail,
                [name]: value,
            }
        });
    };

    handleInputChangeUsername = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;
        console.log("New username: ",name, value);
        this.setState({newUserName: value});
        this.setState((prevState) => {
            return {
                ...prevState.newUserName,
                [name]: value,
            }
        });
    };

    handleInputChangeNewPwRepeat = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;
        console.log("New retype: ",name, value);
        this.setState({newPasswordRepeat: value});
        this.setState((prevState) => {
            return {
                ...prevState.newPasswordRepeat,
                [name]: value,
            }
        });
    };

    //tarkasta täsmääkö uudet salasanat
    checkIfPasswordsMatch = (pw1,pw2) => {
      console.log("Token "+localStorage.getItem('Login-token'));
      if(pw1 === pw2){
        changeUserPassword(localStorage.getItem('Login-token'), pw1).then(data => {
          localStorage.setItem('Pw', pw1); //muutetaan nykyinen salasana localstorageen,
                                          //jottei tule erroria jos samalla loggauksella vaihdetaan salasana 2 kertaa
         //tyhjennetään kentät
          this.setState({oldPassword: ""});
          this.setState({newPassword: ""});
          this.setState({newPasswordRepeat: ""});
          alert("Password successfully changed!");
          return data;
        });
      };
    }

    changePassword = (evt) => {
        evt.preventDefault();
      //tarkistetaan täsmääkö vanha salasana jotta voidaan jatkaa eteenpäin
      if(this.state.oldPassword === this.props.password || this.state.oldPassword === localStorage.getItem('Pw')){
          console.log("Old: "+this.state.oldPassword+" , New: "+this.state.newPassword);
          this.checkIfPasswordsMatch(this.state.newPassword, this.state.newPasswordRepeat);
      }else{
          alert("Passwords are incorrect!");
      }
    };

    changeEmail = (evt) => {
        evt.preventDefault();
          changeUserEmail(localStorage.getItem('Login-token'), this.state.newEmail).then(data => {
          console.log("Email changed successfully!");
          this.state.user.email = this.state.newEmail;
          console.log("Päivitetty user: ",this.state.user);
           //Vaihdetaan App.js staten userin ominaisuudet
         this.props.setUser({user: this.state.user, token: localStorage.getItem('Login-token')});
        });
    };

    changeUsername = (evt) => {
        evt.preventDefault();
        changeUserName(localStorage.getItem('Login-token'), this.state.newUserName).then(data => {
        console.log("Username changed successfully!");
        this.state.user.username = this.state.newUserName;
        console.log("Päivitetty user: ",this.state.user);
       this.props.setUser({user: this.state.user, token: localStorage.getItem('Login-token')}); //Vaihdetaan App.js staten userin ominaisuudet
      });
    };


render()
{
    return (
        <React.Fragment>
            <h1>Profile</h1>
            <h2>Real name: {this.state.user.full_name}</h2>
            <h2>Email: {this.state.user.email}</h2>
            <h2>Username: {this.state.user.username}</h2>

            <div>
                <h3>Change password:</h3>
                <ValidatorForm
                    onSubmit={this.changePassword}
                    onError={errors => console.log(errors)}>
                    <TextValidator
                    type="password"
                    label="Old password"
                    name="password"
                    value={this.state.oldPassword}
                    onChange={this.handleInputChangeOldPw}
                    />
                    <br/>
                    <TextValidator
                        label="New Password"
                        type="password"
                        name="password"
                        value={this.state.newPassword}
                        onChange={this.handleInputChangeNewPw}
                    />
                    <br/>
                    <TextValidator
                        label="Retype New Password"
                        type="password"
                        name="password"
                        value={this.state.newPasswordRepeat}
                        onChange={this.handleInputChangeNewPwRepeat}
                    />
                    <br/>
                    <Button type="submit" variant="contained" onClick={this.changePassword}>Change password</Button>
                </ValidatorForm>
            </div>
            <div>
                <h3>Change Email</h3>
                <ValidatorForm
                    onSubmit={this.changeEmail}
                    onError={errors => console.log(errors)}>
                    <TextValidator
                    type="text"
                    label="New Email"
                    name="email"
                    value={this.state.newEmail}
                    onChange={this.handleInputChangeEmail}
                    />
                    <br/>
                    <Button type="submit" variant="contained" onClick={this.changeEmail}>Change email</Button>
                </ValidatorForm>
            </div>
            <div>
                <h3>Change Username</h3>
                <ValidatorForm
                    onSubmit={this.changeUsername}
                    onError={errors => console.log(errors)}>
                    <TextValidator
                    type="text"
                    label="New Username"
                    name="username"
                    value={this.state.newUserName}
                    onChange={this.handleInputChangeUsername}
                    />
                    <br/>
                    <Button type="submit" variant="contained" onClick={this.changeUsername}>Change Username</Button>
                </ValidatorForm>
            </div>

        </React.Fragment>
    );
};
};

Profile.propTypes = {
    user: PropTypes.object,
    classes: PropTypes.object.isRequired,
};

export default Profile;
