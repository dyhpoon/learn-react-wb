import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import CartItem from "./CartItem";
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
                            <p>You have {me.cart.length} item{me.cart.length == 1 ? '' : 's'} in your cart.</p>
                          </header>
                          
                          <ul>
                            {me.cart.map(cartItem => {
                              return (
                                <CartItem key={cartItem.id} cartItem={cartItem}/>
                              )
                            })}
                          </ul>

                          <footer>
                            <p>{formatMoney(calcTotalPrice(me.cart))}</p>
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

