// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import path from 'path';

// Is our app packaged in a binary or still in Electron?
const appIsPackaged = !process.defaultApp;

/**
 * Get the path to the `static` folder.
 * This is a temporary hack, waiting for the 2 issues to be fixed.
 *
 * @see https://github.com/electron-userland/electron-webpack/issues/52
 * @see https://github.com/electron-userland/electron-webpack/issues/157
 */
export const staticPath = appIsPackaged
  ? __dirname.replace(/app\.asar$/, 'static')
  : path.join(process.cwd(), 'static');
