import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {Redirect, Route} from 'react-router-dom';
import Nav from "../App";
import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import {
    login,
    tokenCheck,
    registerUser,
    checkIfUserNameExists,
    changeForm,
} from '../utils/MediaAPI';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
    Grid, Button, TextField,
} from '@material-ui/core';

const mediaUrl = 'http://media.mw.metropolia.fi/wbma/uploads/';


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
    };

    componentDidMount() {
        console.log("Propseissa tuleva password:",this.props.password+" tai localStoragessa: "+localStorage.getItem('Pw'));
        // korjataan profiilisivun latausongelma
        if(this.props.user === null) {
            return <Redirect to="/"/>;
        };

        //Laitetaan stateksi nykyinen user
        this.state.user = this.props.user;
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

    changePassword = (evt) => {
        evt.preventDefault();
      //tarkistetaan täsmääkö vanha salasana jotta voidaan jatkaa eteenpäin
      if(this.state.oldPassword === this.props.password || this.state.oldPassword === localStorage.getItem('Pw')){
          alert("Salasanat oikein! uusi salasanan vaihto ei vielä valmis...");
          console.log("Old: "+this.state.oldPassword+" , New: "+this.state.newPassword);
      }else{
          alert("Väärät salasanat!");
      }
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
                    <Button type="submit" variant="contained" onClick={this.changePassword}>Change password</Button>
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