// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccount } from '@polkadot/extension-inject/types';
import { SignerPayload } from '@polkadot/types/interfaces';
import { KeypairType } from '@polkadot/util-crypto/types';

export type AuthorizeRequest = [string, MessageAuthorize, string];
export type SigningRequest = [string, MessageExtrinsicSign, string];

export type MessageTypes = keyof PayloadTypes;

export interface TransportRequestMessage<TMessageType extends MessageTypes> {
  id: string;
  message: TMessageType;
  origin: 'page' | 'popup';
  request: PayloadTypes[TMessageType];
}

export interface PayloadTypes {
  'accounts.create': MessageAccountCreate;
  'accounts.edit': MessageAccountEdit;
  'accounts.forget': MessageAccountForget;
  'accounts.list': MessageAccountList;
  'accounts.subscribe': MessageAccountSubscribe;
  'extrinsic.sign': MessageExtrinsicSign;
  'rpc.send': MessageRpcSend;
  'rpc.sendSubscribe': MessageRpcSendSubscribe;
  'seed.create': MessageSeedCreate;
  'seed.validate': MessageSeedValidate;
  'signing.approve': MessageExtrinsicSignApprove;
  'signing.cancel': MessageExtrinsicSignCancel;
  'signing.requests': MessageExtrinsicSignRequests;
  'signing.subscribe': MessageExtrinsicSignSubscribe;
}

type IsNull<T, K extends keyof T> = { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never;
type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T];
export type NullMessageTypes = NullKeys<PayloadTypes>;

export interface MessageAuthorize {
  origin: string;
}

export interface MessageAuthorizeApprove {
  id: string;
}

export interface MessageAuthorizeReject {
  id: string;
}

export type MessageAuthorizeRequests = null;

export type MessageAuthorizeSubscribe = null;

export interface MessageAccountCreate {
  name: string;
  password: string;
  suri: string;
  type?: KeypairType;
}

export interface MessageAccountEdit {
  address: string;
  name: string;
}

export interface MessageAccountForget {
  address: string;
}

export type MessageAccountList = null;

export type MessageAccountSubscribe = null;

export type MessageExtrinsicSign = SignerPayload;

export interface MessageExtrinsicSignApprove {
  id: string;
  password: string;
}

export interface MessageExtrinsicSignCancel {
  id: string;
}

export type MessageExtrinsicSignRequests = null;

export type MessageExtrinsicSignSubscribe = null;

export interface MessageSeedCreate {
  length?: 12 | 24;
  type?: KeypairType;
}

export interface MessageSeedValidate {
  suri: string;
  type?: KeypairType;
}

export interface MessageRpcSend {
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[];
}

export interface MessageRpcSendSubscribe {
  type: string;
  method: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any[];
}

// Responses

interface NonNullResponseTypes {
  'accounts.create': boolean;
  'accounts.edit': boolean;
  'accounts.forget': boolean;
  'accounts.list': InjectedAccount[];
  'accounts.subscribe': boolean;
  'authorize.approve': boolean;
  'authorize.reject': boolean;
  'authorize.requests': AuthorizeRequest[];
  'authorize.subscribe': boolean;
  'extrinsic.sign': MessageExtrinsicSignResponse;
  'rpc.send': MessageRpcSendResponse;
  'rpc.sendSubscribe': MessageRpcSendResponse;
  'seed.create': MessageSeedCreateResponse;
  'seed.validate': MessageSeedValidateResponse;
  'signing.approve': boolean;
  'signing.cancel': boolean;
  'signing.requests': SigningRequest[];
  'signing.subscribe': boolean;
}

export type ResponseTypes = {
  [K in Exclude<MessageTypes, keyof NonNullResponseTypes>]: null;
} &
  NonNullResponseTypes;

export interface TransportSubscriptionNotification {
  subscriptionId: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result?: any;
}

export interface TransportResponseMessage<TMessage extends ResponseMessage> {
  error?: string;
  id: string;
  response?: TMessage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscription?: any;
}

export type ResponseMessage = MessageExtrinsicSignResponse | MessageSeedCreateResponse | MessageSeedValidateResponse;

export interface MessageExtrinsicSignResponse {
  id: string;
  signature: string;
}

export interface MessageSeedCreateResponse {
  address: string;
  seed: string;
}

export interface MessageSeedValidateResponse {
  address: string;
  suri: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageRpcSendResponse = any;

export interface SendRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <TMessageType extends MessageTypes>(
    message: TMessageType,
    request?: PayloadTypes[TMessageType],
    subscriber?: (data: any) => void
  ): Promise<ResponseTypes[TMessageType]>;
}
export type AnyJSON = string | number | boolean | null | { [property: string]: AnyJSON } | AnyJSON[];
