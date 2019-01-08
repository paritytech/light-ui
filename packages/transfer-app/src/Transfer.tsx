// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Container } from '@polkadot/ui-components';

type State = {};

export class Transfer extends React.PureComponent<State> {
  state: State = {};

  render () {
    return <Container>'transfer card goes here'</Container>;
  }
}
