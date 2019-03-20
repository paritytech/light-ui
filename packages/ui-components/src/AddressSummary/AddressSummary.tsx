// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import IdentityIcon from '@polkadot/ui-identicon';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import React from 'react';

import BalanceDisplay from '../Balance';
import { DynamicSizeText, Stacked, StackedHorizontal } from '../Shared.styles';
import { OrientationType, SizeType } from './types';

type SummaryStyles = {
  identiconSize: number,
  nameSize: string
};

type Props = {
  address?: string | KeyringAddress,
  balance?: BN,
  name?: string | React.ReactNode,
  orientation?: OrientationType,
  size?: SizeType
};

const PLACEHOLDER_NAME = 'No Name';
const PLACEHOLDER_ADDRESS = '5'.padEnd(16, 'x');

export class AddressSummary extends React.PureComponent<Props> {
  render () {
    const { address, balance, name, orientation = 'vertical', size = 'medium' } = this.props;
    let styles: SummaryStyles = { identiconSize: 16, nameSize: '14px' };

    switch (size) {
      case 'tiny':
        styles = { identiconSize: 16, nameSize: '14px' };
        break;
      case 'small':
        styles = { identiconSize: 32, nameSize: '18px' };
        break;
      case 'medium':
        styles = { identiconSize: 64, nameSize: '22px' };
        break;
      case 'large':
        styles = { identiconSize: 128, nameSize: '26px' };
        break;
      default:
        break;
    }

    if (orientation === 'vertical') {
      return (
        <Stacked>
          <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
          <DynamicSizeText fontSize={styles.nameSize}> {name || PLACEHOLDER_NAME} </DynamicSizeText>
          { balance && <BalanceDisplay balance={balance} /> }
        </Stacked>
      );
    } else {
      return (
        <StackedHorizontal justify='space-around'>
          <IdentityIcon value={address as string || PLACEHOLDER_ADDRESS} theme={'substrate'} size={styles.identiconSize} />
          <DynamicSizeText fontSize={styles.nameSize}> {name || PLACEHOLDER_NAME} </DynamicSizeText>
          { balance && <BalanceDisplay balance={balance} /> }
        </StackedHorizontal>
      );
    }
  }
}
