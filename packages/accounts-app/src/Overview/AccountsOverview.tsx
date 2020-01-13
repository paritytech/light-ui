// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { SingleAddress } from '@polkadot/ui-keyring/observable/types';
import { WrapperDiv } from '@substrate/ui-components';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { map } from 'rxjs/operators';

import { AccountsOverviewCard } from './AccountsOverviewCard';

type Props = RouteComponentProps;

export function AccountsOverview(props: Props): React.ReactElement {
  const { history } = props;
  const [allUnlockedAccounts, setAllUnlocked] = useState<SingleAddress[]>([]);

  useEffect(() => {
    const accountsSub =
      // eslint-disable-next-line @typescript-eslint/unbound-method
      accountObservable.subject.pipe(map(Object.values)).subscribe(setAllUnlocked);

    return (): void => accountsSub.unsubscribe();
  }, []);

  return (
    <WrapperDiv>
      {allUnlockedAccounts.map((account, i) => {
        return (
          <AccountsOverviewCard
            address={account.json.address}
            name={account.json.meta.name}
            history={history}
            key={i}
          />
        );
      })}
    </WrapperDiv>
  );
}
