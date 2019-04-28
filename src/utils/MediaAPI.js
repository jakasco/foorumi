const apiUrl = 'http://media.mw.metropolia.fi/wbma/';

const login = (username, password) => {
  return fetch(apiUrl + 'login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password}),
  }).then(response => response.json()).then(json => {
    return json;
  });
};

const registerUser = (username, password, full_name, email) => {
  return fetch(apiUrl + 'users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({username, password, full_name, email}),
  }).then(response => response.json()).then(json => {
    return json;
  });
};

const checkIfUserNameExists = (username) => {
  return fetch(apiUrl + 'users/username/' + username).then(response => {
    return response.json();
  }).then(data => {
    return data;
  });
};

const changeUserPassword = (token,pw) => {
  const settings = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({password: pw}),
  };
    return fetch(apiUrl + 'users', settings).then(response => {
    return response.json()
  });
};

const changeUserName = (token,name) => {
  const settings = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({username: name}),
  };
    return fetch(apiUrl + 'users', settings).then(response => {
    return response.json()
  });
};

const changeUserEmail = (token,email) => {
  const settings = {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token': token,
    },
    body: JSON.stringify({email: email}),
  };
    return fetch(apiUrl + 'users', settings).then(response => {
    return response.json()
  });
};

const changeForm = () => {
  if (document.querySelector("#logincontainer").style.display === 'block') {
    document.querySelector("#logincontainer").style.display = 'none';
    document.querySelector('#regcontainer').style.display = 'block';
    document.querySelector('#changeButton').innerHTML = 'Take me back to login!';
  } else {
    document.querySelector("#logincontainer").style.display = 'block';
    document.querySelector('#regcontainer').style.display = 'none';
    document.querySelector('#changeButton').innerHTML = 'New user? Register instead!';
  }
};

const tokenCheck = (token) => {
  return fetch(apiUrl + 'users/user/', {
    headers: {
      'x-access-token': token,
    },
  }).then(response => response.json()).then(json => {
    return json;
  });
};

const getAllMedia = () => {
  return fetch(apiUrl + 'media/').then(response => {
    return response.json();
  }).then(json => {
    console.log(json);
    return Promise.all(json.map(pic => {
      return fetch(apiUrl + 'media/' + pic.file_id).then(response => {
        return response.json();
      });
    })).then(pics => {
      console.log(pics);
      return pics;
    });
  });
};

const getSingleMedia = (id) => {
  return fetch(apiUrl + 'media/' + id).then(response => {
    return response.json();
  });
};

const getComments = (id) =>{
  return fetch(apiUrl + 'comments/file/' + id, {
    Params: {
      'id': id
    },
  }).then(response => response.json()).then(json => {
    console.log(json);
    return json;
  })
};

export {getComments, getSingleMedia, login, registerUser, checkIfUserNameExists, changeForm, tokenCheck, getAllMedia, changeUserPassword, changeUserName, changeUserEmail};
