import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  border-radius: 50%;
  padding: 0.5rem;
  line-height: 2rem;
  min-width: 3rem;
  margin-left: 1rem;
  font-weight: 100;
  font-feature-settings: 'tnum';
  font-variant-numeric: tabular-nums;
`

const AnimationStyles = styled.span`
  position: relative;
  .count {
    display: block;
    position: relative;
    transition: all 0.4s;
    backface-visibility: hidden;
  }
  .count-enter {
    transform: rotateX(0.5turn);
  }
  .count-enter-active {
    transform: rotateX(0);
  }
  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }
  .count-exit-active {
    transform: rotateX(0.5turn);
  }
`

export default class CartCount extends Component {
  static propTypes = {
    count: PropTypes.number.isRequired
  }

  render() {
    const { count } = this.props
    return (
      <AnimationStyles>
        <TransitionGroup>
          <CSSTransition unmountOnExit className="count" classNames="count" key={count} timeout={{ enter: 400, exit: 400 }}>
            <Dot>{count}</Dot>
          </CSSTransition>
        </TransitionGroup>
      </AnimationStyles>
    )
  }
}
