// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export interface WasmRpcClient {
  /**
   * Destroy the WASM light client.
   */
  free(): void;
  /**
   * Allows starting an RPC request. Returns a `Promise` containing the result of that request.
   * @param rpc - The JSONRPC request to send
   */
  rpcSend(rpc: string): Promise<string>;
  /**
   * Subscribes to an RPC pubsub endpoint.
   *
   * @param rpc - The RPC request for subscribing.
   * @param callback - The callback of the subscribe.
   */
  rpcSubscribe(rpc: string, callback: (res: string) => void): void;
}

/**
 * An interface representing a light client compiled to WASM.
 */
export interface LightClient {
  /**
   * An identifier for the light client.
   */
  name: string;
  /**
   * Start running the light client.
   */
  startClient(): Promise<WasmRpcClient>;
  /**
   * A version for the light client.
   */
  version: string;
}
