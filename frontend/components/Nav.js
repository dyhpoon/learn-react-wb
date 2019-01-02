import Link from 'next/link';
import { Mutation } from 'react-apollo';
import { TOGGLE_CART_MUTATION } from "./Cart";
import CartCount from './CartCount';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () => {
  return (
    <User>
      {({ data: { me }}) => {
        return (
          <NavStyles>
            <Link href="/items">
              <a>Shop</a>
            </Link>

            {me && 
              <>
                <Link href="/sell">
                  <a>Sell</a>
                </Link>
                <Link href="/orders">
                  <a>Orders</a>
                </Link>
                <Link href="/me">
                  <a>Account</a>
                </Link>
                <Signout />
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                  {toggleCart => {
                    return (
                      <button onClick={toggleCart}>My Cart <CartCount count={me.cart.reduce((accum, cartItem) => {
                        return accum + cartItem.quantity
                      }, 0)}/></button>
                    )
                  }}
                </Mutation>
              </>
            }
            {!me && (
              <Link href="/signup">
                <a>Signup</a>
              </Link>
            )}
          </NavStyles>
        )
      }}
    </User>
  );
};

export default Nav;
