// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { u32 } from '@polkadot/types';
import { BalanceOf, BlockNumber, VoteIndex } from '@polkadot/types/interfaces';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Grid, SubHeader } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

export function CouncilSummary () {
  const { api } = useContext(AppContext);

  const [carryCount, setCarryCount] = useState();
  const [desiredSeats, setDesiredSeats] = useState();
  const [termDuration, setTermDuration] = useState();
  const [voteCount, setVoteCount] = useState();
  const [votingBond, setVotingBond] = useState();
  const [votingPeriod, setVotingPeriod] = useState();

  useEffect(() => {
    try {
      setCarryCount(api.consts.elections.carryCount);
      setDesiredSeats(api.consts.elections.desiredSeats);
      setVotingBond(api.consts.elections.votingBond);
      setVotingPeriod(api.consts.elections.votingPeriod);

      const subscription = combineLatest([
        (api.query.council.termDuration() as unknown as Observable<BlockNumber>),
        (api.query.council.voteCount() as unknown as Observable<VoteIndex>)
      ]).pipe(take(1))
        .subscribe(([termDuration, voteCount]) => {
          setTermDuration(termDuration);
          setVoteCount(voteCount);
        });
      return () => subscription.unsubscribe();
    } catch (e) {
      const subscription = combineLatest([
        (api.query.council.carryCount() as unknown as Observable<u32>),
        (api.query.council.desiredSeats() as unknown as Observable<u32>),
        (api.query.council.termDuration() as unknown as Observable<BlockNumber>),
        (api.query.council.voteCount() as unknown as Observable<VoteIndex>),
        (api.query.council.votingBond() as unknown as Observable<BalanceOf>),
        (api.query.council.votingPeriod() as unknown as Observable<BlockNumber>)
      ])
        .pipe(
          take(1)
        )
        .subscribe(([carryCount, desiredSeats, termDuration, voteCount, votingBond, votingPeriod]) => {
          setCarryCount(carryCount);
          setDesiredSeats(desiredSeats);
          setTermDuration(termDuration);
          setVoteCount(voteCount);
          setVotingBond(votingBond);
          setVotingPeriod(votingPeriod);
        });
      return () => subscription.unsubscribe();
    }
  }, []);

  return (
    <React.Fragment>
      <Grid.Row centered>
        <Grid.Column width='4'>
          <SubHeader>Term Duration: </SubHeader>
          <FadedText>{termDuration && termDuration.toString()} Blocks</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Desired Seats: </SubHeader>
          <FadedText>{desiredSeats && desiredSeats.toString()} Seats</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Carry Count: </SubHeader>
          <FadedText>{carryCount && carryCount.toString()} Seats</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Votes Count: </SubHeader>
          <FadedText>{voteCount && voteCount.toString()} Votes </FadedText>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width='4'>
          <SubHeader>Voting Bond:</SubHeader>
          <FadedText>{votingBond && votingBond.toString()}</FadedText>
        </Grid.Column>
        <Grid.Column width='4'>
          <SubHeader>Voting Period:</SubHeader>
          <FadedText>{votingPeriod && votingPeriod.toString()}</FadedText>
        </Grid.Column>
      </Grid.Row>
    </React.Fragment>
  );
}
