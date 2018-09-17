import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { registerUser } from '../actions/auth';
import DisplayNameForm from '../components/DisplayNameForm';
import NavBar from '../components/NavBar';

export class RegistrationPage extends React.Component {
  // componentDidUpdate() {
  //   if(this.props.alreadyRegistered) {
  //     this.props.history.push('/dashboard');
  //   }
  // }
  onSubmit = async (displayName) => {
    try {
      await this.props.registerUser(displayName);
      this.props.history.push('/dashboard');
    } catch (e) {
      console.log(e);
    }
  }
  render() {
    return (
      <div>
        <NavBar />
        <DisplayNameForm onSubmit={this.onSubmit} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  alreadyRegistered: state.auth
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(RegistrationPage));
