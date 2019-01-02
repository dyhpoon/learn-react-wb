import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation removeFromCartMutation($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${props => props.theme.red};
    cursor: pointer;
  }
`

export default class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }

  update = (cache, payload) => {
    // first read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY })
    
    // remove the item from cart
    const cartItemId = payload.data.removeFromCart.id
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id != cartItemId)

    // write it back to cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data })
  }

  render() {
    const { id } = this.props
    return (
      <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id }} update={this.update} optimisticResponse={{ __typename: 'Mutation', removeFromCart: { __typename: 'CartItem', id: this.props.id } }}>
        {(removeFromCart, { loading, error }) => {
          return (
            <BigButton disabled={loading} onClick={() => {
              removeFromCart().catch(err => {
                alert(err.message)
              })
            }} title="Delete Item">&times;</BigButton>
          )
        }}
      </Mutation>
    )
  }
}