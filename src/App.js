import React, {Component} from 'react';
import './App.css';
import {HashRouter as Router, Route} from 'react-router-dom';
import {Redirect} from 'react-router';
import Nav from './components/Nav';
import Login from './views/Login';
import {tokenCheck, getAllMedia, getFilesWithTag} from './utils/MediaAPI';
import {Grid} from '@material-ui/core';
import Profile from './views/Profile';
import Upload from './views/Upload';
import Front from './views/Front';
import Single from './views/Single';
import ButtonAppBar from './components/UusNav';
import MyFiles from './views/MyFiles';

class App extends Component {
  state = {
    picArray: [],
    user: [],
    currentPw: '',
  };

  getMedia = () => {
  getAllMedia().then((pics) => {
    console.log(pics);
    this.setState({picArray: pics});
  });
};


  componentDidMount() {
    //tää tokencheck on tässä sitä varten että tallentaa stateen errormessagen
    // jos ei oo logged in. Render ei tee sitten nav komponenttia sen takia.
    // jos käyttäjälle ei tuu errormessage niin nav renderaantuu.
    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      if (data.message) {
        this.setState({errorMessage: data.message});
      } else {
        this.setState({user: data});
        this.setState({errorMessage: ''});
        console.log("App state user: ",data);
      }
    });
    this.updateImages();
  }

  //vanhan salasanan gettaamiseen profiilisivulle
  getPassword = (data) => {
    this.setState({currentPw: data});
    console.log("Currentpw: "+this.state.currentPw);
  }

  setUser = (data) => {

    //Loginnaatessa tallentaaa userin tiedot stateen ja talalentaa login tokenin.
    //Laittaa stateen errorMessagen tyhjäksi, jolloin navigointi renderaantuu
    this.setState({user: data.user});
    localStorage.setItem('Login-token', data.token);
    console.log("Login-token: "+data.token);
    this.setState({errorMessage: ''});
  };

  logout = () => {
    //Tyhjentää userin tiedot statesta, ja tyhjentää login tokenin. Sitten hakee
    //errormessagen stateen jottei navi renderöidy ja lopuksi redirectaa login sivulle
    this.setState({user: ''});
    localStorage.clear();
    tokenCheck(localStorage.getItem('Login-token')).then(data => {
      this.setState({errorMessage: data.message});
    });
    return <Redirect to='/'/>;
  };

  // päivittää kuvat kun sivun lataa
  updateImages = () => {


    getFilesWithTag("bksTag").then((pics) => {
      console.log(pics);
      this.setState({picArray: pics});
    });
  };




  render() {
    console.log("picArray: ",this.state.picArray);
    return (
        <Router>
          <Grid container>
            <Grid item md={12} xs={12} style={{marginBottom: '10px'}}>
              {!this.state.errorMessage && <ButtonAppBar/>}
            </Grid>
            <Grid container  direction="column" alignContent="center" style={{alignItems: 'center'}}>
              <Route exact path="/" render={(props) => (
                  <Login {...props} setUser={this.setUser} getPw={this.getPassword}/>
              )}/>
              <Route exact path="/home" render={(props) => (
                  <Front {...props} picArray={this.state.picArray}/>
              )}/>
              <Route path="/profile" render={(props) => (
                  <Profile {...props} user={this.state.user} password={this.state.currentPw} setUser={this.setUser}/>
              )}/>
              <Route exact path="/logout" component={this.logout}/>
              <Route exact path="/single/:id" component={Single}/>
              <Route path="/upload" render={(props) => (
                <Upload {...props} getMedia={this.updateImages}/>
            )}/>
              <Route path="/my-files" render={(props) => (
                  <MyFiles {...props} user={this.state.user}/>
              )}/>
            </Grid>
          </Grid>
        </Router>
    );
  }
}

export default App;
