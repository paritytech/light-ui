// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ChildProcess, spawn } from 'child_process';

import { bundledPath, logger } from '../util';

let substrateProc: ChildProcess;

/**
 * Create a process and run the bundled substrate node
 */
export function runSubstrate(): void {
  if (substrateProc) {
    logger.error('Unable to initialise Parity Substrate more than once');
    return;
  }

  const substrateFlags = ['--light', '--rpc-cors', 'file://'];
  logger.info(`Running ${'`'}substrate ${substrateFlags.join(' ')}${'`'}`);
  const substrate = spawn(bundledPath, substrateFlags);

  substrate.stdout.on('data', data => {
    logger.info(data.toString());
  });
  substrate.stderr.on('data', error => {
    // Substrate outputs in stderr, so we .info here
    logger.info(error.toString());
  });
  substrate.on('error', error => {
    logger.error(`Substrate process errored: ${error.toString()}`);
  });
  substrate.on('exit', code => {
    logger.debug(`Substrate process exited with code: ${code && code.toString()}`);
  });

  substrateProc = substrate;
}

export function killSubstrate(): void {
  if (substrateProc) {
    logger.info('Killing Substrate');
    substrateProc.kill();
  }
}
