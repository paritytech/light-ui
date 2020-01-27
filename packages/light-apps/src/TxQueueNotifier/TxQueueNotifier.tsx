// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AlertsContext, ApiContext, TxQueueContext } from '@substrate/context';
import { Alert, Message, StackedHorizontal, TxSummary } from '@substrate/ui-components';
import React, { useContext, useEffect } from 'react';

export function TxQueueNotifier(): React.ReactElement | null {
  const { enqueue } = useContext(AlertsContext);
  const { system } = useContext(ApiContext);
  const { cancelObservable, errorObservable, successObservable } = useContext(TxQueueContext);

  // Display notification on success
  useEffect(() => {
    const subscription = successObservable.subscribe(details => {
      const { amount, methodCall, recipientAddress, senderPair } = details;

      const content = (
        <Alert success>
          <StackedHorizontal justifyContent='space-around'>
            <Message.Header>Transaction Completed!</Message.Header>
            <TxSummary
              amount={amount}
              methodCall={methodCall}
              recipientAddress={recipientAddress}
              senderAddress={senderPair.address}
              // FIXME Maybe should a loader when we don't have a symbol?
              tokenSymbol={system?.properties?.tokenSymbol.toString()}
            />
          </StackedHorizontal>
        </Alert>
      );

      enqueue({
        content: content,
        type: 'success',
      });
    });

    return (): void => subscription.unsubscribe();
  }, [enqueue, successObservable, system]);

  // Display notification on error
  useEffect(() => {
    const subscription = errorObservable.subscribe(details => {
      const { error } = details;

      const content = (
        <Alert error>
          <Message.Header>Error! </Message.Header>
          <Message.Content> {error} </Message.Content>
        </Alert>
      );

      enqueue({
        content: content,
        type: 'error',
      });
    });

    return (): void => subscription.unsubscribe();
  }, [errorObservable, enqueue]);

  useEffect(() => {
    const subscription = cancelObservable.subscribe(details => {
      const { msg } = details;

      const content = (
        <Alert warning>
          <Message.Header>Extrinsic cancelled.</Message.Header>
          <Message.Content>{msg}</Message.Content>
        </Alert>
      );

      enqueue({
        content: content,
        type: 'warning',
      });
    });

    return (): void => subscription.unsubscribe();
  }, [cancelObservable, enqueue]);

  return null;
}
