// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Margin, WalletCard } from '@substrate/ui-components';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MatchParams as BaseMatchParams } from '../types';
import { SaveAddress } from './SaveAddress';

interface MatchParams extends BaseMatchParams {
  address: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export class Edit extends React.PureComponent<Props> {
  render () {
    const { match: { params: { address } } } = this.props;
    return (
      <WalletCard
        header='Edit Address'
        subheader='Inspect the status of any identity and name it for later use' >
        <Margin top />
        <SaveAddress addressDisabled defaultAddress={address} />
      </WalletCard>
    );
  }
}
