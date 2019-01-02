import gql from 'graphql-tag';
import React, { Component } from 'react';
import { adopt } from 'react-adopt';
import { Mutation, Query } from 'react-apollo';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import CartItem from "./CartItem";
import CartStyles from './styles/CartStyles';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import Supreme from './styles/Supreme';
import TakeMyMoney from './TakeMyMoney';
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

const Composed = adopt({
  user: ({ render }) => <User>{ render }</User>,
  toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{ render }</Mutation>,
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{ render }</Query>,
})

class Cart extends Component {
  render() {
    return (
      <Composed>
        {({ user, toggleCart, localState }) => {
          const me = user.data.me
          if (!me) return null;
          return (
            <CartStyles open={localState.data.cartOpen}>
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
                <TakeMyMoney>
                  <SickButton>Checkout</SickButton>
                </TakeMyMoney>
              </footer>
              </CartStyles>
          )
        }}
      </Composed>
    );
  }
}

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };

