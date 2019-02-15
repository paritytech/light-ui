// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ChainProperties } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import React from 'react';
import { Observable, zip } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ApiContext } from './ApiContext';
import { isTestChain } from './util';

interface State {
  isReady: boolean;
}

export class ApiGate extends React.PureComponent {
  private api = new ApiRx();
  state = { isReady: false } as State;

  componentDidMount () {
    // Get info about the current chain
    zip(
      this.api.isReady,
      (this.api.rpc.system.chain()),
      // FIXME Correct types should come from @polkadot/api to avoid type assertion
      (this.api.rpc.system.properties() as unknown as Observable<ChainProperties>)
    ).pipe(
      take(2)
    ).subscribe((chainInfo) => {
      const chain = chainInfo[1];
      const properties = chainInfo[2];
      const networkId = properties.get('networkId') || 42;

      // Setup keyring (loadAll) only after prefix has been set
      keyring.setAddressPrefix(networkId);
      keyring.setDevMode(isTestChain(chain || ''));
      keyring.loadAll();

      this.setState({ isReady: true });
    });
  }

  render () {
    const { children } = this.props;
    const { isReady } = this.state;

    // FIXME Return a nicer component when loading
    return isReady
      ? <ApiContext.Provider value={{ api: this.api, keyring }}>{children}</ApiContext.Provider>
      : <div>Loading...</div>;
  }
}
