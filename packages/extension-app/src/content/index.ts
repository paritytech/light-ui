// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import extension from 'extensionizer';

const port = extension.runtime.connect({ name: 'content' });

port.onMessage.addListener((data: any) => {
  window.postMessage({ ...data, origin: 'content' }, '*');
});

window.addEventListener('message', ({ data, source }): void => {
  if (source !== window || data.origin !== 'page') {
    return;
  }

  port.postMessage(data);
})

const script = document.createElement('script');

// FIXME getURL() is deprecated
script.src = extension.extension.getURL('page.js');
script.onload = () => {
  if (script.parentNode) {
    script.parentNode.removeChild(script);
  }
}

(document.head || document.documentElement).appendChild(script);