import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Query } from 'react-apollo';
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

class User extends Component {
  render() {
    const user = this.props.user
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map(permission => {
          return (
            <td>
              <label htmlFor={`${user.id}-perission-${permission}`}>
                <input type="checkbox"></input>
              </label>
            </td>
          )
        })}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
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
                        return (<th>{permission}</th>)
                      })}
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.users.map(user => <User user={user}/>)}
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
