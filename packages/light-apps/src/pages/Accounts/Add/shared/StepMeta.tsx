// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  Input,
  Margin,
  NavButton,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
} from '@substrate/ui-components';
import React, { useCallback } from 'react';

interface Props {
  goToNextStep?: () => void;
  goToPreviousStep?: () => void;
  name: string;
  password: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export function AddAccountStepMeta(props: Props): React.ReactElement {
  const {
    goToNextStep,
    goToPreviousStep,
    name,
    password,
    setName,
    setPassword,
    setError,
  } = props;

  const handleGoToNextStep = useCallback(() => {
    if (!name || !password) {
      return setError('Please fill in all fields.');
    }

    goToNextStep && goToNextStep();
  }, [goToNextStep, name, password, setError]);

  return (
    <Stacked>
      <Input
        autoFocus
        fluid
        min={1}
        onChange={handler(setName)}
        textLabel='Name'
        type='text'
        value={name}
      />
      <Input
        fluid
        min={8}
        onChange={handler(setPassword)}
        type='password'
        textLabel='Passphrase'
        value={password}
      />
      <Margin top />
      <StackedHorizontal justifyContent='space-between'>
        {goToPreviousStep && (
          <StyledLinkButton color='gray' onClick={goToPreviousStep}>
            Back
          </StyledLinkButton>
        )}
        {goToNextStep && (
          <NavButton onClick={handleGoToNextStep}>Next</NavButton>
        )}
        <StyledLinkButton className='o-0'>Back</StyledLinkButton>
      </StackedHorizontal>
    </Stacked>
  );
}
