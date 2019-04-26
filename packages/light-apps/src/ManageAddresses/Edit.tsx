// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Margin, NavLink, Stacked, SubHeader } from '@substrate/ui-components';

import { SaveAddress } from './SaveAddress';

interface MatchParams {
  currentAccount: string;
  editAddress: string;
}

interface Props extends RouteComponentProps<MatchParams> { }

export class Edit extends React.PureComponent<Props> {
  render () {
    const { match: { params: { currentAccount, editAddress } } } = this.props;
    return (
      <Stacked>
        <SubHeader> Rename this address in your address book. </SubHeader>
        <Margin top />
        <NavLink to={`/addresses/${currentAccount}`}> Add a New Address </NavLink>
        <SaveAddress addressDisabled defaultAddress={editAddress} />
      </Stacked>
    );
  }
}
