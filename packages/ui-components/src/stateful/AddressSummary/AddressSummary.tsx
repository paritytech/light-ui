// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import IdentityIcon from '@polkadot/react-identicon';
import { fromNullable } from 'fp-ts/lib/Option';
import React from 'react';

import { Address } from '../../Address';
import { Balance } from '../Balance';
import { Margin } from '../../Margin';
import { DynamicSizeText, FadedText, SubHeader, Stacked, StackedHorizontal } from '../../Shared.styles';
import { OrientationType, SizeType } from './types';
import { FlexJustify, FontSize } from '../../types';

type AddressSummaryProps = {
  address?: string, // TODO support AccountId
  bondingPair?: string, // TODO support AccountId
  detailed?: boolean,
  isNominator?: boolean,
  isValidator?: boolean,
  justifyContent?: FlexJustify,
  name?: string,
  noPlaceholderName?: boolean,
  noBalance?: boolean,
  orientation?: OrientationType,
  type?: 'stash' | 'controller',
  size?: SizeType,
  withShortAddress?: boolean;
};

const PLACEHOLDER_NAME = 'No Name';

export function AddressSummary (props: AddressSummaryProps) {
  const {
    address,
    justifyContent = 'space-around',
    orientation = 'vertical',
    size = 'medium'
  } = props;

  return fromNullable(address)
    .map((address: string) => {
      return orientation === 'vertical'
          ? (
            <Stacked justifyContent={justifyContent}>
              {renderIcon(address, size)}
              {renderDetails(address, props)}
            </Stacked>
          )
          : (
            <StackedHorizontal justifyContent={justifyContent}>
              {renderIcon(address, size)}
              <Margin left />
              <Stacked>
                {renderDetails(address, props)}
              </Stacked>
            </StackedHorizontal>
          );
    })
    .getOrElse(<div>No Address Provided</div>);
}

const ICON_SIZES = {
  tiny: 16,
  small: 32,
  medium: 64,
  large: 128
};

function renderIcon (address: string, size: SizeType) {
  return <IdentityIcon value={address} theme={'substrate'} size={ICON_SIZES[size]} />;
}

const FONT_SIZES: any = {
  tiny: 'small',
  small: 'medium',
  medium: 'large',
  large: 'big'
};

function renderBadge (type: string) {
  // FIXME make it an actual badge
  return type === 'nominator' ? <SubHeader>nominator</SubHeader> : <SubHeader>validator</SubHeader>;
}

function renderDetails (address: string, props: Exclude<AddressSummaryProps, keyof 'address'>) {
  const { bondingPair, detailed, isNominator, isValidator, name = PLACEHOLDER_NAME, noBalance, noPlaceholderName, size = 'medium', type, withShortAddress } = props;

  return (
    <Stacked>
      <DynamicSizeText fontSize={FONT_SIZES[size] as FontSize}> {noPlaceholderName ? null : name} </DynamicSizeText>
      { withShortAddress && <Address address={address} shortened />}
      { type && <FadedText> Account Type: {type} </FadedText>}
      { bondingPair && <StackedHorizontal><FadedText> Bonding Pair: </FadedText> {renderIcon(bondingPair, 'tiny')} </StackedHorizontal> }
      { isNominator && renderBadge('nominator') }
      { isValidator && renderBadge('validator') }
      {!noBalance && <Balance address={address} detailed={detailed} fontSize={FONT_SIZES[size] as FontSize} />}
    </Stacked>
  );
}
