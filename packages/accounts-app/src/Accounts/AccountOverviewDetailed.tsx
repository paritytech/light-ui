// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types';
import { StakingContext } from '@substrate/ui-common';
import { AddressSummary, Grid, Loading, Margin, Stacked, StyledNavLink, SubHeader, WithSpace } from '@substrate/ui-components';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useEffect, useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

import { BalanceOverview } from './BalanceOverview';
import { rewardDestinationOptions } from '../constants';

interface MatchParams {
  currentAccount: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  address: string;
  name: string;
}

export function AccountOverviewDetailed (props: Props) {
  const { history, match: { params: { currentAccount } } } = props;
  const { accountStakingMap, allStashes } = useContext(StakingContext);
  const [nominees, setNominees] = useState();
  const stakingInfo = accountStakingMap[currentAccount];

  useEffect(() => {
    setNominees(stakingInfo && stakingInfo.nominators && stakingInfo.nominators.map(nominator => nominator.toString()));
  }, []);

  const renderBalanceDetails = () => {
    return (
      <Card>
        <Card.Content>
        {
          fromNullable(stakingInfo)
            .map((stakingInfo) => <BalanceOverview history={history} {...stakingInfo} />)
            .getOrElse(<Loading active />)
        }
        </Card.Content>
      </Card>
    );
  };

  const renderNominationDetails = () => {
    return (
      <Card>
        <Card.Content>
          <SubHeader noMargin>Currently Nominating:</SubHeader>
          <WithSpace style={{ height: '30rem', overflow: 'auto' }}>
            {
              fromNullable(nominees)
                .map(nominees => nominees.map((nomineeId: string, index: string) =>
                  <AddressSummary
                    address={nomineeId}
                    key={index}
                    orientation='horizontal'
                    size='small'
                  />
                ))
              .getOrElse(
                <Stacked>
                    Not Nominating Anyone.
                    <StyledNavLink to={`/manageAccounts/${currentAccount}/validators`}>View Validators</StyledNavLink>
                </Stacked>)
            }
          </WithSpace>
          <WithSpace>
            <Grid.Row>
              <SubHeader>Reward Destination: </SubHeader>
              {
                fromNullable(stakingInfo)
                  .mapNullable(({ rewardDestination }) => rewardDestination)
                  .map(rewardDestination => rewardDestinationOptions[rewardDestination.toNumber()])
                  .getOrElse('Reward Destination Not Set...')
              }
            </Grid.Row>
          </WithSpace>
        </Card.Content>
      </Card>
    );
  };

  const renderGeneral = () => {
    const isStashNominating = fromNullable(stakingInfo)
      .mapNullable(({ nominators }) => nominators)
      .map(nominators => nominators.length > 0)
      .getOrElse(false);

    const isStashValidating = fromNullable(allStashes)
      .map(allStashes => allStashes.includes(new AccountId(currentAccount)))
      .getOrElse(false);

    const accountType = fromNullable(stakingInfo).map(stakingInfo => new AccountId(currentAccount) === stakingInfo.controllerId ? 'controller' : 'stash');
    const bondingPair = fromNullable(stakingInfo)
      .map(stakingInfo => accountType.fold(
        undefined,
        (accountType) => accountType === 'controller' ? stakingInfo.stashId : stakingInfo.controllerId
      ))
      .getOrElse(undefined);

    return (
      <Card.Group doubling stackable>
        <Margin left='huge' />
        <Card>
          <Card.Content>
            <AddressSummary
              address={currentAccount}
              bondingPair={bondingPair && bondingPair.toString()}
              detailed
              isNominator={isStashNominating}
              isValidator={isStashValidating}
              name={name}
              size='small' />
          </Card.Content>
        </Card>
        <Margin left />
        {renderBalanceDetails()}
        <Margin left />
        {renderNominationDetails()}
      </Card.Group>
    );
  };

  return (
    <Grid columns='16'>
      {
        fromNullable(stakingInfo)
          .map(stakingInfo => renderGeneral())
          .getOrElse(<div></div>)
      }
    </Grid>
  );
}
