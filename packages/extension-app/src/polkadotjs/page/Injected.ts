// Copyright 2019-2020 @polkadot/extension authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Injected } from '@polkadot/extension-inject/types';

import Accounts from './Accounts';
import PostMessageProvider from './PostMessageProvider';
import Signer from './Signer';
import { SendRequest } from './types';

export default class implements Injected {
  public readonly accounts: Accounts;

  public readonly provider: PostMessageProvider;

  public readonly signer: Signer;

  constructor(sendRequest: SendRequest) {
    this.accounts = new Accounts(sendRequest);
    this.provider = new PostMessageProvider(sendRequest);
    this.signer = new Signer(sendRequest);
  }
}
