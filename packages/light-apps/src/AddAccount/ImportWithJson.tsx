// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson } from '@polkadot/ui-keyring/types';
import { AlertsContext, AppContext, handler } from '@substrate/ui-common';
import { Dropdown, ErrorText, Input, InputFile, Margin, NavButton, Stacked, SubHeader, WrapperDiv } from '@substrate/ui-components';
import React, { useState, useContext } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { Tags, TagOptions } from './types';

type Step = 'upload' | 'password';

interface Props extends RouteComponentProps { }

export function ImportWithJson (props: Props) {
  const { enqueue } = useContext(AlertsContext);
  const { keyring } = useContext(AppContext);

  const [errorText, setErrorText] = useState();
  const [step, setStep] = useState('upload' as Step);
  const [inputPassword, setInputPassword] = useState('');
  const [jsonString, setJsonString] = useState('');

  const [tagOptions, setTagOptions] = useState<TagOptions>([
    { key: '0', text: 'stash', value: 'Stash' },
    { key: '1', text: 'controller', value: 'Controller' }
  ]);

  const [tags, setTags] = useState<Tags>([]);

  const checkAndAddTags = (json: KeyringJson) => {
    if (json.meta.tags) {
      json.meta.tags.forEach((tag: string): void => {
        setTagOptions([...tagOptions, { key: tag, text: tag, value: tag }]);
      });

      setTags(json.meta.tags as Tags);
    }
  };

  const handleAddTag = (e: React.SyntheticEvent, { value }: any) => {
    setTagOptions([...tagOptions, { key: value, text: value, value }]);
  };

  const handleOnChange = (event: React.SyntheticEvent, { value }: any) => {
    setTags(value);
  };

  const handleFileUploaded = async (file: string | null) => {
    try {
      if (!file) {
        throw new Error('File was empty. Make sure you uploaded the correct file and try again.');
      }

      checkAndAddTags(JSON.parse(file));

      setJsonString(file);
      setStep('password');
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error'
      });
    }
  };

  const handleRestoreWithJson = () => {
    try {
      const json = JSON.parse(jsonString);

      const isAlreadyInKeyring = keyring.getAccounts().filter(account => account.address === json.address).length > 0;

      if (isAlreadyInKeyring) {
        setErrorText('You have already unlocked this account in your keyring!');
        return;
      }

      if (tags) {
        json.meta.tags = json.meta.tags.concat(tags);
      }

      keyring.restoreAccount(json, inputPassword);
    } catch (e) {
      enqueue({
        content: e.message,
        type: 'error'
      });
    }
  };

  const renderSetTags = () => {
    return (
      <Stacked>
        <SubHeader noMargin>Add Tags:</SubHeader>
        <Dropdown
          allowAdditions
          closeOnChange
          fluid
          multiple
          onAddItem={handleAddTag}
          onChange={handleOnChange}
          options={tagOptions}
          search
          selection
          value={tags} />
      </Stacked>
    );
  };

  return (
    <Stacked>
      <SubHeader> Restore Account from JSON Backup File </SubHeader>
      {
        step === 'upload'
          ? <InputFile onChange={handleFileUploaded} />
          : (
            <React.Fragment>
              <WrapperDiv>
                <Input
                  fluid
                  label='Password'
                  onChange={handler(setInputPassword)}
                  type='password' />
                <Margin top />
                {renderSetTags()}
              </WrapperDiv>
              <Margin top />
              <ErrorText>{errorText}</ErrorText>
              <NavButton onClick={handleRestoreWithJson} value='Restore' />
            </React.Fragment>
          )
      }
    </Stacked>
  );
}
