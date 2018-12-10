import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Error from './ErrorMessage';
import Form from './styles/Form';
import { CURRENT_USER_QUERY } from './User';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      id
      name
      email
      permissions
    }
  }
`

export default class Reset extends Component {
  static propTypes = {
    resetToken: PropTypes.string.isRequired,
  }

  state = {
    password: '',
    confirmPassword: '',
  }

  saveToState = e => {
    e.preventDefault()
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    return (
      <Mutation mutation={RESET_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]} variables={{
        resetToken: this.props.resetToken,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword,
      }}>
        {(reset, { error, loading, called }) => {
          return (
            <Form disabled={loading} aria-busy={loading} method="post" onSubmit={async e => {
              e.preventDefault()
              await reset()
              this.setState({ password: "", confirmPassword: "" })
            }}>
              <fieldset>
                  <h2>Reset your password</h2>
                  <Error error={error} />
                  <label htmlFor="password">
                    password
                    <input type="password" name="password" placeholder="password" value={this.state.password} onChange={this.saveToState}></input>
                  </label>
                  <label htmlFor="confirmPassword">
                    confirmPassword
                    <input type="password" name="confirmPassword" placeholder="confirmPassword" value={this.state.confirmPassword} onChange={this.saveToState}></input>
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
