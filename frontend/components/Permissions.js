import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Error from './ErrorMessage';
import SickButton from './styles/SickButton';
import Table from './styles/Table';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
]

const UPDATE_PERMISSION_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const ALL_USER_QUERY = gql`
  query ALL_USER_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`

class UserPermissions extends Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
      permissions: PropTypes.array.isRequired,
    }).isRequired
  }

  state = {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = (e) => {
    const checkbox = e.target
    let updatedPermissions = [...this.state.permissions]
    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value)
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission != checkbox.value)
    }
    this.setState({
      permissions: updatedPermissions
    })
  }

  render() {
    const user = this.props.user
    return (
      <Mutation mutation={UPDATE_PERMISSION_MUTATION} variables={{ permissions: this.state.permissions, userId: this.props.user.id }}>
        {(updatePermissions, { loading, error }) => {
          return (
            <>
              {error && <tr><td colspan="8"><Error error={error} /></td></tr>}
              <tr>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {possiblePermissions.map(permission => {
                  return (
                    <td key={permission}>
                      <label htmlFor={`${user.id}-perission-${permission}`}>
                        <input id={`${user.id}-perission-${permission}`} type="checkbox" checked={this.state.permissions.includes(permission)} value={permission} onChange={this.handlePermissionChange}></input>
                      </label>
                    </td>
                  )
                })}
                <td>
                  <SickButton type="button" disabled={loading} onClick={updatePermissions}>Updat{ loading ? 'ing' : 'e' }</SickButton>
                </td>
              </tr>
            </>
          )
        }}
      </Mutation>
    )
  }
}

export default class Permissions extends Component {
  render() {
    return (
      <Query query={ALL_USER_QUERY}>
        {({ data, loading, error }) => {
          return (
            <div>
              <Error error={error}></Error>
              <div>
                <h2>Manage Permissions</h2>
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      {possiblePermissions.map(permission => {
                        return (<th key={permission}>{permission}</th>)
                      })}
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(user => <UserPermissions key={user.id} user={user}/>)}
                  </tbody>
                </Table>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}
