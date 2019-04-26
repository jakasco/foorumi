import React, {Component} from 'react';
import './App.css';
import {HashRouter as Router, Route} from 'react-router-dom';
import {Redirect} from 'react-router';
import Nav from './components/Nav';
import Home from './views/Home';
import Login from './views/Login';
import {getAllMedia, tokenCheck} from './utils/MediaAPI';
import {Grid} from '@material-ui/core';
import Upload from './views/Upload';
import Front from './views/Front';

class App extends Component {
  state = {
    picArray: [],
    user: [],
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
      }
    });
    this.updateImages();
  }

  setUser = (data) => {
    //Loginnaatessa tallentaaa userin tiedot stateen ja talalentaa login tokenin.
    //Laittaa stateen errorMessagen tyhjäksi, jolloin navigointi renderaantuu
    this.setState({user: data.user});
    localStorage.setItem('Login-token', data.token);
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
    getAllMedia().then((pics) => {
      console.log(pics);
      this.setState({picArray: pics});
    });
  };



  render() {
    return (
        <Router>
          <Grid container>
            <Grid item md={2} xs={12}>
              {!this.state.errorMessage && <Nav/>}
            </Grid>
            <Grid item md={10} xs={12}>
              <Route exact path="/" render={(props) => (
                  <Login {...props} setUser={this.setUser}/>
              )}/>
              <Route exact path="/home" render={(props) => (
                  <Front {...props} picArray={this.state.picArray}/>
              )}/>
              <Route exact path="/logout" component={this.logout}/>
              <Route path="/upload" render={(props) => (
                  <Upload {...props} getMedia={this.getMedia}/>
              )}/>
            </Grid>
          </Grid>
        </Router>
    );
  }
}

export default App;
