import gql from 'graphql-tag';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import StripeCheckout from 'react-stripe-checkout';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, { CURRENT_USER_QUERY } from './User';

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

function totalItems(cart) {
  return cart.reduce((accum, cartItem) => {
    return accum + cartItem.quantity
  }, 0)
}

export default class TakeMyMoney extends Component {
  onToken = (res, createOrder) => {
    createOrder({
      variables: {
        token: res.id
      }
    }).catch(err => {
      alert(err.message)
    })
  }

  render() {
    return (
      <User>
        {({ data: { me } }) => {
          return (
            <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[ { query: CURRENT_USER_QUERY } ]}>
              {(createOrder) => {
                return (
                  <StripeCheckout
                    amount={calcTotalPrice(me.cart)}
                    name="Sick Fits"
                    description={`Order of ${totalItems(me.cart)}`}
                    image={me.cart[0].item && me.cart[0].item.image}
                    stripeKey="pk_test_3pMZ9pvUAFffxPbNs0h3madq"
                    currency="USD"
                    email={me.email}
                    token={res => this.onToken(res, createOrder)}
                  >
                    {this.props.children}
                  </StripeCheckout>
                )
              }}
            </Mutation>
          )
        }}
      </User>
    )
  }
}
