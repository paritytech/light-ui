// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUICard, { CardProps as SUICardProps } from 'semantic-ui-react/dist/commonjs/views/Card';
import styled from 'styled-components';

type CardProps = SUICardProps;

const StyledCard = styled<any>(SUICard)`
 &&& {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);
  height: ${props => props.height || '357px'};
  min-height: ${props => props.minHeight || '100%'};
  width: 100%;
  overflow: ${props => props.overflow || 'none'};
 }
`;

Card.Content = SUICard.Content;
Card.Description = SUICard.Description;
Card.Group = SUICard.Group;
Card.Header = SUICard.Header;

export function Card (props: CardProps) {
  return (
    <StyledCard {...props} />
  );
}
