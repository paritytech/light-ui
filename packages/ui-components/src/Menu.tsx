// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIMenu, {
  MenuProps as SUIMenuProps,
} from 'semantic-ui-react/dist/commonjs/collections/Menu/Menu';
import SUIDivider from 'semantic-ui-react/dist/commonjs/elements/Divider/Divider';
import styled from 'styled-components';

import { polkadotOfficialTheme } from './globalStyle';

interface MenuProps extends SUIMenuProps {
  tabs?: boolean;
  shadow?: boolean;
}

const StyleTab = {
  shadow: `
    box-shadow: inset 0 -12px 12px -10px rgba(0, 0, 0, 0.25);
  `,
  menu: `
    min-height: 0;
    border: none;
    margin-bottom: 0;
  `,
  item: `
    border-radius: 0;
    &:hover {
      cursor: pointer;
    }
    &.active {
      background: ${polkadotOfficialTheme.black};
      color: ${polkadotOfficialTheme.white};
      &:hover {
        background: ${polkadotOfficialTheme.black};
      }
    }
    &:not(.active):hover {
      color: ${polkadotOfficialTheme.signal};
    }
  `,
};

const StyledMenu = styled<typeof SUIMenu>(SUIMenu)`
  &&& {
    ${props => (props.tabs ? StyleTab.menu : '')};
    ${props => (props.shadow ? StyleTab.shadow : 'box-shadow: none')};
    &.medium .item {
      height: 48px;
    }
    .item {
      ${props => (props.tabs ? StyleTab.item : '')};
    }
  }
  box-shadow: 0 0 0 ${polkadotOfficialTheme.white};
`;

export function Menu(props: MenuProps): React.ReactElement {
  const { shadow = true, ...rest } = props;
  return <StyledMenu shadow={shadow} {...rest} />;
}

Menu.Divider = SUIDivider;
Menu.Item = SUIMenu.Item;
