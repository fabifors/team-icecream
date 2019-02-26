import React, { Component } from 'react';
import Button from '../../components/UI/Button';
import { Fieldset, Input } from './style';
import { StyledLink } from '../../GeneralStyles';
import * as ROUTES from '../../constants/routes';
import 'firebase/auth';
import 'firebase/database';
import { withFirebase } from '../Firebase';
import Carousel from '../../components/SwipeCarusel';
import { hatsArray, catsArray } from './data';



class Form extends Component {
  constructor(props) {
    super(props);
    this.state = { displayName: '' };



    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    // this.setState({ value: event.target.value });
    this.setState({ displayName: event.target.value });
  }
  handleSubmit() {
    alert(`Welcome to the game  ${this.state.displayName}`);
    //event.preventDefault();
  }

  onSubmit = event => {

    this.props.firebase
      .then(authUser => {
        // Create a user in your Firebase realtime database
        this.props.firebase
          .user(authUser.user.uid)
          .push().child("displayName").setValue(this.state.displayName)
          .then(() => {
            this.setState({ error: null });
            this.props.history.push(ROUTES.MAP);

          })
          .catch(error => {
            this.setState({ error });
          });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };



  render() {
    const { displayName } = this.state;
    return (
      <form onSubmit={this.handleSubmit} >
        <Fieldset>
          <Input
            type="text"
            placeholder="WRITE YOUR DISPLAY NAME HERE"
            value={displayName}
            onChange={this.handleChange}
            flex
            row
            fullW
            margin
          />
        </Fieldset>
        <StyledLink to={ROUTES.MAP}>
          <Button
            type="submit"
            value="submit"
            text="START"
            onClick={() => this.handleSubmit()}
            fullW
            margin
            center
          />
        </StyledLink>
      </form>
    )
  }
}

export default Form;