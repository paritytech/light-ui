// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/**
 * All paths inside transfer are sub-routes of: `/transfer/:currentAccount`
 */
export interface MatchParams {
  currentAccount: string;
}
