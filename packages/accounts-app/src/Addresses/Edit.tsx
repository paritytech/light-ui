// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Margin, Stacked, SubHeader } from '@substrate/ui-components';
import React from 'react';
import { Link } from 'react-router-dom';

import { SaveAddress } from './SaveAddress';

export function Edit(): React.ReactElement {
  return (
    <>
      <Link to='/addresses'>&larr; Back</Link>
      <Stacked>
        <SubHeader>Edit Address</SubHeader>
        <Margin top />
        <SaveAddress />
      </Stacked>
    </>
  );
}
