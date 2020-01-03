// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringContextProvider } from '@substrate/accounts-app';
import {
  AlertsContextProvider,
  ApiContextProvider,
  ApiContext,
  ApiContextType,
  StakingContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React from 'react';

export function ContextGate(props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <ApiContextProvider loading={<Loading active>Connecting to the node...</Loading>}>
          <ApiContext.Consumer>
              {({
                isReady,
              }: Partial<ApiContextType>): React.ReactElement | boolean | undefined =>
                isReady && (
              <KeyringContextProvider>
                <StakingContextProvider>{children}</StakingContextProvider>
              </KeyringContextProvider>
              )
            }
          </ApiContext.Consumer>
        </ApiContextProvider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}