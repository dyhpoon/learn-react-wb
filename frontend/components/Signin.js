import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User'

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export default class Signin extends Component {
  state = {
    password: '',
    email: '',   
  }

  saveToState = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={SIGNIN_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signin, { error, loading }) => {
          return (
            <Form disabled={loading} aria-busy={loading} method="post" onSubmit={async e => {
              e.preventDefault()
              const res = await signin()
              this.setState({ name: "", email: "", password: "" })
            }}>
              <fieldset>
                  <h2>Sign in for an account</h2>
                  <Error error={error} />
                  <label htmlFor="email">
                    email
                    <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState}></input>
                  </label>
                  <label htmlFor="password">
                    password
                    <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState}></input>
                  </label>
                  <button type="submit">Sign In!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
