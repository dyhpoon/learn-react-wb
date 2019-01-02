import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Query } from 'react-apollo';

const CURRENT_USER_QUERY = gql`
  query {
    me {
      id
      name
      email
      permissions
      cart {
        id
        quantity
        item {
          id
          price
          image
          title
          description
        }
      }
    }
  }
`

export default class User extends Component {
  render() {
    return (
      <Query {...this.props} query={CURRENT_USER_QUERY}>
        {payload => this.props.children(payload)}
      </Query>
    )
  }
}

User.propTypes = {
  children: PropTypes.func.isRequired
}

export { CURRENT_USER_QUERY };

