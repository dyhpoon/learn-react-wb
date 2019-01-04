import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      email
      name
    }
  }
`

export default class Signup extends Component {
  state = {
    name: '',
    password: '',
    email: '',   
  }

  saveToState = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading }) => {
          return (
            <Form disabled={loading} aria-busy={loading} method="post" onSubmit={async e => {
              e.preventDefault()
              const res = await signup()
              this.setState({ name: "", email: "", password: "" })
            }}>
              <fieldset>
                  <h2>Sign up for an account</h2>
                  <Error error={error} />
                  <label htmlFor="email">
                    email
                    <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState}></input>
                  </label>
                  <label htmlFor="name">
                    name
                    <input type="text" name="name" placeholder="name" value={this.state.name} onChange={this.saveToState}></input>
                  </label>
                  <label htmlFor="password">
                    password
                    <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState}></input>
                  </label>
                  <button type="submit">Sign Up!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export { SIGNUP_MUTATION }
