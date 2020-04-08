// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import { useLocalStorage } from '@rehooks/local-storage';
import {
  Circle,
  ConnectedNodes,
  Dropdown,
  DropdownProps,
} from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  HealthContext,
  HealthContextType,
  InjectedContext,
  ProviderContext,
} from '../../context';
import {
  discoverChain,
  getAllProviders,
  getAllProvidersForChain,
  LazyProvider,
} from './discover';

const l = logger('choose-provider');

// To keep it above the loading dimmer
const TopDropdown = styled(Dropdown)`
  z-index: 1000;
`;

const GREEN = '#79c879';
const RED = '#ff0000';

function renderHealth(health: HealthContextType): React.ReactElement {
  return (
    <div className='flex items-center justify-between truncate mr4'>
      {!health.isSyncing && health.hasPeers && health.isNodeConnected ? (
        <Circle fill={GREEN} radius={10} />
      ) : (
        <Circle fill={RED} radius={10} />
      )}
    </div>
  );
}

function renderBlockNumber(
  health: HealthContextType
): React.ReactElement | null {
  if (!health.best) {
    return null;
  }

  return (
    <span className='ml2 db-l dn f7 silver truncate'>Block #{health.best}</span>
  );
}

/**
 * From all the providers we have, derive all the chains.
 */
function getAllChains(allProviders: Record<string, LazyProvider>): string[] {
  return [
    ...new Set(Object.values(allProviders).map(({ network }) => network)),
  ];
}

export function ChooseProvider(): React.ReactElement {
  // We store the last used provider in localStorage
  const [providerId, setProviderId] = useLocalStorage<string | undefined>(
    'currentProvider'
  );

  const health = useContext(HealthContext);
  const { injected } = useContext(InjectedContext);
  const { lazy, setLazyProvider } = useContext(ProviderContext);

  const [allProviders, setAllProviders] = useState<
    Record<string, LazyProvider>
  >();
  const [chain, setChain] = useState<string>();

  const allChains = allProviders ? getAllChains(allProviders) : [];
  const allProvidersForChain =
    chain && allProviders ? getAllProvidersForChain(chain, allProviders) : [];

  // Get the list of all available providers
  useEffect(() => {
    getAllProviders({ injected }).then(setAllProviders).catch(l.error);
  }, [injected]);

  // Once we get the list of chains, select one
  useEffect(() => {
    // If we already chose a chain, skip
    if (chain) {
      return;
    }

    // If we already have a provider, set it to the provider's chain
    if (providerId && allProviders && allProviders[providerId]) {
      return setChain(allProviders[providerId].network);
    }

    // If we didn't populate the chains yet, skip
    if (!allChains.length) {
      return;
    }

    // Choose westend by default (it works the best with light client
    // currently).
    if (allChains.includes('westend')) {
      return setChain('westend');
    }
    // Or else choose kusama
    if (allChains.includes('westend')) {
      return setChain('westend');
    }
    // Or else just choose the first one
    setChain(allChains[0]);
  }, [chain, allChains, providerId, allProviders]);

  // Discover best provider when we switch chain
  useEffect(() => {
    // If we already have a provider, skip
    if (providerId && allProviders && allProviders[providerId]) {
      return;
    }

    // If we don't have a chain yet, skip
    if (!chain || !allProviders) {
      return;
    }

    const bestProvider = discoverChain(chain, allProviders);

    if (!bestProvider) {
      return l.error(`Cannot find provider for chain ${chain}`);
    }

    setProviderId(bestProvider.id);
  }, [allProviders, chain, providerId, setLazyProvider, setProviderId]);

  // From providerId, set the actual provider
  useEffect(() => {
    const provider = providerId && allProviders && allProviders[providerId];

    if (provider) {
      setLazyProvider(provider);
    } else if (providerId) {
      l.error(`Cannot find provider with id ${providerId}`);
    }
  });

  return (
    <ConnectedNodes>
      <div className='flex flex-row'>
        {renderHealth(health)}
        <TopDropdown
          onChange={(
            _event: React.SyntheticEvent,
            { value }: DropdownProps
          ): void => {
            // Set the providerId temporarily to `undefined`. The effect will
            // discover the best provider to use.
            setProviderId(undefined);

            setChain(value as string);
          }}
          options={allChains.map((chain) => ({
            key: chain,
            text: chain,
            value: chain,
          }))}
          placeholder='Loading chains...'
          value={chain}
        />
        {renderBlockNumber(health)}
      </div>

      <TopDropdown
        disabled={!chain}
        onChange={(
          _event: React.SyntheticEvent,
          { value }: DropdownProps
        ): void => {
          setProviderId(value as string);
        }}
        options={allProvidersForChain.map((lazy) => ({
          key: lazy.id,
          text: `${lazy.description}`,
          value: lazy.id,
        }))}
        placeholder='Discovering providers...'
        value={lazy?.id}
      />
    </ConnectedNodes>
  );
}
