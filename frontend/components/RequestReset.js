import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

export default class Signin extends Component {
  state = {
    email: '',   
  }

  saveToState = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(reset, { error, loading, called }) => {
          return (
            <Form disabled={loading} aria-busy={loading} method="post" onSubmit={async e => {
              e.preventDefault()
              await reset()
              this.setState({ email: "" })
            }}>
              <fieldset>
                  <h2>Request a password reset</h2>
                  <Error error={error} />
                  {!error && !loading && called && <p>Success! Check your email for a reset link</p>}
                  <label htmlFor="email">
                    email
                    <input type="email" name="email" placeholder="email" value={this.state.email} onChange={this.saveToState}></input>
                  </label>
                  <button type="submit">Reset password</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
