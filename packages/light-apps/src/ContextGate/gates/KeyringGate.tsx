// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { KeyringContext } from '../context/KeyringContext';

/**
 * A gate that shows a loading screen if the node is not connected yet
 */
export function KeyringGate({
  children,
}: {
  children?: React.ReactElement;
}): React.ReactElement | null {
  const { isKeyringReady } = useContext(KeyringContext);

  return (
    <Loading active={!isKeyringReady} loadingText='Setting up keyring...'>
      {isKeyringReady && children}
    </Loading>
  );
}
