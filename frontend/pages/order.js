import React from 'react';
import OrderList from '../components/OrderList';
import PleaseSignIn from "../components/PleaseSignIn";

const order = () => {
  return (
    <div>
      <PleaseSignIn>
        <OrderList />
      </PleaseSignIn>
    </div>
  );
};

export default order;