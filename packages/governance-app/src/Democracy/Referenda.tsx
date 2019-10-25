// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ReferendumInfoExtended } from '@polkadot/api-derive/type';
import { Option } from '@polkadot/types';
import { AppContext } from '@substrate/ui-common';
import { FadedText, Header, Stacked, Table } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { ReferendumRow } from './ReferendumRow';

export function Referenda (): React.ReactElement {
  const { api } = useContext(AppContext);
  const [referenda, setReferenda] = useState<Option<ReferendumInfoExtended>[]>();

  useEffect(() => {
    const subscription = api.derive.democracy.referendums()
      .subscribe(setReferenda);
    return (): void => subscription.unsubscribe();
  }, []);

  const renderEmptyTable = (): React.ReactElement => {
    return (
      <Table.Row>
        <Table.Cell>
          <FadedText>No Active Referenda...</FadedText>
        </Table.Cell>
      </Table.Row>
    );
  };

  const renderReferendaTable = (_referenda: Option<ReferendumInfoExtended>[]): React.ReactElement => {
    return (
      <>
        {_referenda.map((_referendum: Option<ReferendumInfoExtended>) => {
          const referendum = _referendum.unwrapOr(null);

          return (
            referendum &&
            <ReferendumRow idNumber={referendum.index} key={referendum.index.toString()} referendum={referendum} />
          );
        })
        }
      </>
    );
  };

  const renderReferendaTableHeaderRow = (): React.ReactElement => {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID #</Table.HeaderCell>
          <Table.HeaderCell>Proposal</Table.HeaderCell>
          <Table.HeaderCell>Enactment Delay</Table.HeaderCell>
          <Table.HeaderCell>Total Votes</Table.HeaderCell>
          <Table.HeaderCell>Time Remaining</Table.HeaderCell>
          <Table.HeaderCell>Status</Table.HeaderCell>
          <Table.HeaderCell>Actions</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  };

  return (
    <Stacked alignItems='flex-start'>
      <Header margin='small'>Public Referenda </Header>
      <Table>
        {renderReferendaTableHeaderRow()}
        <Table.Body>
          {
            referenda && referenda.length
              ? renderReferendaTable(referenda)
              : renderEmptyTable()
          }
        </Table.Body>
      </Table>
    </Stacked>
  );
}
