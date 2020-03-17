// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import keyring from '@polkadot/ui-keyring';
import ExtensionStore from '@polkadot/ui-keyring/stores/Extension';
import { assert } from '@polkadot/util';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import extension from 'extensionizer';

import { PORT_CONTENT, PORT_EXTENSION } from '../polkadotjs/defaults';
import { handler } from './handler';

// listen to all messages and handle appropriately
extension.runtime.onConnect.addListener((port): void => {
  // shouldn't happen, however... only listen to what we know about
  assert(
    [PORT_CONTENT, PORT_EXTENSION].includes(port.name),
    `Unknown connection from ${port.name}`
  );

  // message and disconnect handlers
  // FIXME any
  port.onMessage.addListener((data): void =>
    handler(data as any, (port as unknown) as chrome.runtime.Port)
  );
  port.onDisconnect.addListener((): void =>
    console.log(`Disconnected from ${port.name}`)
  );
});

// initial setup
cryptoWaitReady()
  .then((): void => {
    console.log('crypto initialized');

    // load all the keyring data
    keyring.loadAll({ store: new ExtensionStore(), type: 'sr25519' });

    console.log('initialization completed');
  })
  .catch((error): void => {
    console.error('initialization failed', error);
  });
