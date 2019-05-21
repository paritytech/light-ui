// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber, Tuple, Vector } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { AddressSummary, Card, FadedText, Header, StackedHorizontal } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export function CouncilMembers () {
  const { api, keyring } = useContext(AppContext);
  const [activeCouncil, setActiveCouncil] = useState();

  useEffect(() => {
    const subscription =
      (api.query.council.activeCouncil() as unknown as Observable<Vector<Tuple>>)
        .subscribe((activeCouncil) => {
          setActiveCouncil(activeCouncil);
        });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <React.Fragment>
      <Header>Active Council ({activeCouncil && activeCouncil.length}) </Header>
      {
        activeCouncil && activeCouncil.map(([accountId, blockNumber]: [AccountId, BlockNumber]) => {
          let name;
          try {
            name = keyring.getAccount(accountId).getMeta().name;
          } catch (e) {
            name = '';
          }
          return (
            <Card height='120px' key={accountId.toString()}>
              <Card.Content>
                <StackedHorizontal>
                  <AddressSummary address={accountId.toString()} name={name} orientation='horizontal' size='medium' />
                  <FadedText >Valid till block #{blockNumber.toString()}</FadedText>
                </StackedHorizontal>
              </Card.Content>
            </Card>
          );
        })
      }
    </React.Fragment>
  );
}
