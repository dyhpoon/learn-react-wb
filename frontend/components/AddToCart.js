import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { CURRENT_USER_QUERY } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation addToCart($id: ID!) {
    addToCart(id: $id) {
      id
      quantity
    }
  }
`

export default class AddToCart extends Component {
  render() {
    const { id } = this.props
    return (
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(addToCart, { loading }) => {
          return (
            <button disabled={loading} onClick={addToCart}>Add{loading && 'ing'} to Cart</button>
          )
        }}
      </Mutation>
    )
  }
}
