// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { handler } from '@substrate/context';
import {
  ErrorText,
  FramedBlock,
  Input,
  InputFile,
  Margin,
  Menu,
  NavButton,
  Stacked,
} from '@substrate/ui-components';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

type Props = RouteComponentProps;

export function RestoreWithJson(_props: Props): React.ReactElement {
  const [error, setError] = useState('');
  const [step, setStep] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [inputPassword, setInputPassword] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [jsonString, setJsonString] = useState('');

  const handleFileUploaded = (file: string | null): void => {
    if (!file) {
      return setError(
        'File was empty. Make sure you uploaded the correct file and try again.'
      );
    }

    setJsonString(file);
    setStep(step + 1);
  };

  const handleRestoreWithJson = (): void => {
    try {
      // See https://github.com/polkadot-js/extension/issues/187
      setError("We don't allow importing from JSON yet.");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Stacked>
      <Menu borderless shadow={false} tabs size='tiny'>
        <Menu.Item active>Restore Account from JSON Backup File</Menu.Item>
      </Menu>
      {step === 0 ? (
        <FramedBlock>
          <InputFile onChange={handleFileUploaded} />
        </FramedBlock>
      ) : (
        <>
          <Input
            fluid
            onChange={handler(setInputPassword)}
            type='password'
            textLabel='Password'
          />
          <ErrorText>{error}</ErrorText>
          <Margin top />
          <NavButton
            onClick={handleRestoreWithJson}
            value='Restore'
            wrapClass='flex w-100 justify-around'
          />
        </>
      )}
    </Stacked>
  );
}
