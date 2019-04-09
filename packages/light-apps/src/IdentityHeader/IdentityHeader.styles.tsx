// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import PolkadotInputAddress from '@polkadot/ui-app/InputAddress';
import styled from 'styled-components';
import { Margin, StackedHorizontal } from '@substrate/ui-components';

import { NodeStatusProps } from './types';

// These styles are the same as if we added `fluid={true}` prop. Unfortunately
// PolkadotInputAddress doesn't pass down props to SUI components.
export const InputAddress = styled(PolkadotInputAddress)`
  .dropdown {
    min-width: 0;
    width: '25%;
  }
`;

const RedCircle = () => (
  <svg height='10' width='10'>
    <circle cx='5' cy='5' r='5' fill='red' />
  </svg>
);

const GreenCircle = () => (
  <svg height='10' width='10'>
    <circle cx='5' cy='5' r='5' fill='green' />
  </svg>
);

export const NodeStatus = ({ isSyncing }: NodeStatusProps) => (
  <StackedHorizontal >
    { isSyncing ? <RedCircle /> : <GreenCircle /> }
    <Margin left='small' />
    <p> Status: {isSyncing ? 'Syncing' : 'Synced'} </p>
  </StackedHorizontal>
);
