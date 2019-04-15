// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ErrorText, List, Stacked, SubHeader } from '@substrate/ui-components';
import { Either } from 'fp-ts/lib/Either';
import { fromEither } from 'fp-ts/lib/Option';
import React from 'react';

import { AllExtrinsicData, Errors, Warnings } from './types';
import { validateWarnings } from './validate';

interface Props {
  values: Either<Errors, AllExtrinsicData>;
}

export class Validation extends React.PureComponent<Props> {
  render () {
    const { values } = this.props;
    const warnings = fromEither(values).chain(validateWarnings);

    return (
      <Stacked alignItems='flex-start'>
        {values.fold(this.renderErrors, this.renderNull)}
        {warnings.fold(null, this.renderWarnings)}
      </Stacked>
    );
  }

  renderErrors (errors: Errors) {
    // For now we assume there's only one error, and show it. It should be
    // relatively easy to extend to show multiple errors.
    const error = Object.values(errors)[0];

    return (
      <React.Fragment>
        <SubHeader textAlign='left'>Errors</SubHeader>
        <ErrorText>
          {error}
        </ErrorText>
      </React.Fragment>
    );
  }

  renderNull () {
    return null;
  }

  renderWarnings (warnings: Warnings) {
    return (
      <React.Fragment>
        <SubHeader textAlign='left'>Warnings</SubHeader>
        <List>
          {warnings.map((warning) => <List.Item key={warning}>{warning}</List.Item>)}
        </List>
      </React.Fragment>
    );
  }
}
