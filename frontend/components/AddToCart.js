import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';

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
      <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
        {(addToCart) => {
          return (
            <button onClick={addToCart}>Add to Cart</button>
          )
        }}
      </Mutation>
    )
  }
}
