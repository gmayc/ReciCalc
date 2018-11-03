import React, { Component } from 'react';
import axios from 'axios';
import ChangeUser from './ChangeUser.jsx';
import ChangePass from './ChangePass.jsx';
import {Menu} from 'semantic-ui-react';

class Account extends Component {
  constructor(props) {
    super(props);
    this.state ={
      token: localStorage.getItem('Token'),
      userId: sessionStorage.getItem('userId'),
      username: sessionStorage.getItem('username'),
      newUsername: '',
      password: '',
      activeItem: 'username'
    };
    this.changeUser = this.changeUser.bind(this);
    this.changePass = this.changePass.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount(){
    this.setState({
      token: localStorage.getItem('Token')
    });
  }



  changeUser(newUsername, password) {
    axios.post(`/user/changeUsername/?Token=${this.state.token}`, {
      newUsername: newUsername, 
      username:this.state.username, 
      password: password
    })
    .then((data) => {
      console.log(data);

      this.props.logout();
      this.setState({
        token: null,
        userId: null,
        username: null,
        newUsername: '',
        password: '',
        activeItem: ''
      });
      alert('Username changed successfuly, log in with new username');
      this.props.history.push('/');
    })
    .catch((err) => {
      let parsed = JSON.stringify(err);
      parsed = JSON.parse(parsed);
      if (parsed.response.data === "Wrong Password") {
        alert(parsed.response.data);
      } else if (parsed.response.data === "Username already exists") {
        alert(parsed.response.data);
      }

    });
  }

  changePass(op,np){
    console.log(op,np);
    axios.post(`/user/changePassword/?Token=${this.state.token}`, {
      newPassword: np, 
      username:this.state.username, 
      password: op
    })
    .then((data) => {
      console.log(data);
      alert(data.data);
      this.props.history.push('/create');
    })
    .catch((err) => {
      let parsed = JSON.stringify(err);
      parsed = JSON.parse(parsed);
      console.log(parsed);
      if (parsed.response.data === "Wrong Password") {
        alert(parsed.response.data);
      }

    });
  }

  handleItemClick(e, { name }) { 
    console.log(name);
    this.setState({ activeItem: name });
    if (name === 'logout') {
      this.props.logout();
    }
  }

  render() {
    let comp;
    if(this.state.activeItem === 'username'){
      comp = <ChangeUser changeUser={this.changeUser}/>;
   } else if(this.state.activeItem === 'password') {
      comp = <ChangePass changePass={this.changePass}/>;
   } 
    return (
      <div class="account">
      <Menu secondary vertical>
      <div class="acc-menu">
        <Menu.Header name='Account Settings' className='menu-header'>Account Settings</Menu.Header>
        <Menu.Item name='username' active={this.state.activeItem === 'username'} onClick={this.handleItemClick}/>
        <Menu.Item name='password' active={this.state.activeItem === 'password'} onClick={this.handleItemClick} />
        <Menu.Item name='logout' active={this.state.activeItem === 'logout'} onClick={() => this.props.logout()} href='/'/>
      </div>
      </Menu>
      {comp} 
      </div>
    )
  }
}


export default Account;