// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import { ErrorText, Input, Margin, NavButton, Stacked, SubHeader, WrapperDiv } from '@substrate/ui-components';
import { Either, left, right, tryCatch2v } from 'fp-ts/lib/Either';
import { none, Option, some } from 'fp-ts/lib/Option';
import React, { useContext, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { KeyringContext } from '../KeyringContext';

type Props = RouteComponentProps;

interface UserInput {
  name: string;
  password: string;
  recoveryPhrase: string;
}
interface UserInputError extends Partial<UserInput> {
  createAccount?: string;
}

/**
 * Validate user inputs
 */
function validate(values: UserInput): Either<UserInputError, UserInput> {
  const errors = {} as UserInputError;

  (['name', 'password', 'recoveryPhrase'] as (keyof UserInput)[])
    .filter(key => !values[key])
    .forEach(key => {
      errors[key] = `Field "${key}" cannot be empty`;
    });

  if (values.recoveryPhrase.split(' ').length !== 12) {
    errors.recoveryPhrase = 'Invalid phrase. Please check it and try again.';
  }

  return Object.keys(errors).length ? left(errors) : right(values);
}

function renderError(error: Option<string>): React.ReactElement | null {
  return error.fold(null, err => <ErrorText>{err}</ErrorText>);
}

export function ImportWithPhrase(props: Props): React.ReactElement {
  const { history } = props;
  const { keyring } = useContext(KeyringContext);

  const [error, setError] = useState<Option<string>>(none);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');

  const handleUnlockWithPhrase = (): void => {
    validate({ name, password, recoveryPhrase })
      .chain(({ recoveryPhrase }) =>
        tryCatch2v(
          () => {
            // This is inside tryCatch, because it might fail
            keyring.createFromUri(recoveryPhrase.trim(), {}, 'sr25519');
          },
          err => ({ createAccount: (err as Error).message })
        )
      )
      .fold(
        err => setError(some(Object.values(err)[0])), // If there are errors, only show the 1st one
        () => history.push('/')
      );
  };

  return (
    <Stacked justifyContent='space-between'>
      <SubHeader> Import Account from Mnemonic Recovery Phrase </SubHeader>
      <WrapperDiv width='95%'>
        <SubHeader>Phrase</SubHeader>
        <Input fluid onChange={handler(setRecoveryPhrase)} type='text' value={recoveryPhrase} />
        <Margin top />
        <SubHeader>Name</SubHeader>
        <Input fluid label='Name' onChange={handler(setName)} type='text' value={name} />
        <Margin top />
        <SubHeader>Password</SubHeader>
        <Input fluid label='Password' onChange={handler(setPassword)} type='password' value={password} />
      </WrapperDiv>
      <Margin top />
      <NavButton onClick={handleUnlockWithPhrase} value='Restore' />
      {renderError(error)}
    </Stacked>
  );
}
