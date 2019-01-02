import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import User from './User';

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`

class Cart extends Component {
  render() {
    return (
      <User>
        {({ data: { me } }) => {
          if (!me) return null;
          return (
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              { toggleCart => {
                return (
                  <Query query={LOCAL_STATE_QUERY}>
                    {({ data }) => {
                      return (
                        <CartStyles open={data.cartOpen}>
                          <header>
                            <CloseButton onClick={toggleCart} title="close">&times;</CloseButton>
                            <Supreme>Your Cart</Supreme>
                            <p>You have __ items in your cart.</p>
                          </header>
                            
                          <footer>
                            <p>$10.10</p>
                            <SickButton>Checkout</SickButton>
                          </footer>
                          </CartStyles>
                      )
                    }}
                  </Query>
                )
              } }
            </Mutation>
          )
        }}
      </User>
    );
  }
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };

