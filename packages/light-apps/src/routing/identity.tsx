// Copyright 2017-2018 @polkadot/light-apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from '../types';

import { Identity } from '@polkadot/identity-app';

export default (
  {
    Component: Identity,
    i18n: {
      defaultValue: 'Identity'
    },
    icon: 'users',
    isApiGated: true,
    isHidden: false,
    name: 'Identity'
  }
) as Route;
