// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Compact } from '@polkadot/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import substrateLogo from '@polkadot/ui-assets/polkadot-circle.svg';
import { HealthContext, SystemContext } from '@substrate/context';
import { Circle, FadedText, Margin, Stacked, StackedHorizontal, SubHeader } from '@substrate/ui-components';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

const GREEN = '#79c879';
const RED = '#ff0000';

export function renderBlockCounter(blockNumber?: Compact<BlockNumber>, chainName?: string): React.ReactElement {
  return (
    <>
      <SubHeader noMargin>{chainName ? chainName.toString() : 'Loading...'}</SubHeader>
      <div>Block #: {blockNumber ? blockNumber.toString() : 'Loading...'}</div>
    </>
  );
}

export function renderNodeStatus(isSyncing: boolean): React.ReactElement {
  return (
    <StackedHorizontal>
      {isSyncing ? <Circle fill={GREEN} radius={10} /> : <Circle fill={RED} radius={10} />}
      <Margin left='small' />
      <p>Status: {isSyncing ? 'Syncing' : 'Synced'}</p>
    </StackedHorizontal>
  );
}

export function TopBar(): React.ReactElement {
  const { isSyncing } = useContext(HealthContext);
  const { chain, header, name, version } = useContext(SystemContext);

  return (
    <header>
      <StackedHorizontal justifyContent='space-between' alignItems='center'>
        <Link to='/'>
          <img alt='Polkadot Logo' src={substrateLogo} width={50} />
        </Link>
        <FadedText>
          {name} {version}
        </FadedText>
        <Stacked>
          {renderNodeStatus(isSyncing)}
          {renderBlockCounter(header.number, chain.toString())}
        </Stacked>
      </StackedHorizontal>
      <Margin bottom />
    </header>
  );
}
