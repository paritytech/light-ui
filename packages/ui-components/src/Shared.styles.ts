// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import SUIContainer from 'semantic-ui-react/dist/commonjs/elements/Container';
import styled from 'styled-components';

import { FONT_SIZES, FONT_WEIGHTS, MARGIN_SIZES } from './constants';
import { polkadotOfficialTheme } from './globalStyle';
import {
  DynamicSizeTextProps,
  FlexItemProps,
  HeaderProps,
  NodeSelectorProps,
  StackProps,
  StyledNavButtonProps,
  StyledNavLinkProps,
  SubHeaderProps,
  WithSpaceAroundProps,
  WithSpaceBetweenProps,
  WrapperDivProps,
} from './StyleProps';

export const ContainerFlex = styled(SUIContainer)`
  display: flex !important;
`;
export const Container = styled(SUIContainer)`
  padding-top: ${MARGIN_SIZES.large};
  padding-bottom: ${MARGIN_SIZES.large};
`;

export const BoldText = styled.b`
  color: ${polkadotOfficialTheme.black};
`;

export const FadedText = styled.p`
  color: ${polkadotOfficialTheme.black};
  font-weight: ${FONT_WEIGHTS.light};
  opacity: 0.5;
  text-align: left;
`;

export const FlexItem = styled.div<FlexItemProps>`
  flex: ${(props): number => props.flex || 1};
`;

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  font-weight: 500;
`;

export const SuccessText = styled.p`
  color: green;
  text-align: center;
  font-weight: 500;
`;

export const WithSpace = styled.div`
  margin: ${MARGIN_SIZES.medium} auto;
`;

export const WithSpaceAround = styled.div<WithSpaceAroundProps>`
  margin: ${(props): string => MARGIN_SIZES[props.margin || 'medium']};
  padding: ${(props): string => MARGIN_SIZES[props.padding || 'medium']};
`;

export const WithSpaceBetween = styled.div<WithSpaceBetweenProps>`
  display: flex ${(props): string => props.flexDirection || 'row'};
  justify-content: space-between;
  align-items: space-between;
`;

export const WithPadding = styled.div`
  padding: ${MARGIN_SIZES.medium} auto;
`;

// TODO: props from figma
export const Header = styled.h2<HeaderProps>`
  font-weight: ${FONT_WEIGHTS.extraBold};
  font-size: ${FONT_SIZES.big};
  margin: ${(props): string =>
    props.margin ? MARGIN_SIZES[props.margin] : `0`};
  text-align: ${(props): string => props.textAlign || 'left'};
`;

export const DynamicSizeText = styled.p<DynamicSizeTextProps>`
  font-size: ${(props): string => FONT_SIZES[props.fontSize || 'medium']};
  font-weight: ${(props): string => props.fontWeight || 'light'};
  margin: 0 0;
  text-align: center;
`;

export const RefreshButton = styled.button`
  border: none;
  background-color: inherit;
  color: ${polkadotOfficialTheme.hotPink};

  :hover {
    cursor: pointer;
    color: ${polkadotOfficialTheme.maroon};
  }
`;

export const StyledNavLink = styled.span<StyledNavLinkProps>`
  background: none;
  border: none;
  color: ${(props): string =>
    props.inverted
      ? polkadotOfficialTheme.white
      : polkadotOfficialTheme.hotPink};
  font-size: ${FONT_SIZES.medium};
  font-weight: 300;

  :hover {
    cursor: pointer;
  }
`;

export const StyledLinkButton = styled.button`
  align-items: space-between;
  background: none;
  border: none;
  color: ${(props): string => props.color || polkadotOfficialTheme.lightBlue1};
  display: flex;
  font-size: ${FONT_SIZES.medium};
  font-weight: 300;
  justify-content: space-between;

  :hover {
    cursor: pointer;
  }
`;

export const StyledNavButton = styled.button<StyledNavButtonProps>`
  position: relative;
  background-color: ${polkadotOfficialTheme.black};
  border: none;
  border-radius: 9999px;
  color: ${polkadotOfficialTheme.white};
  font-size: ${FONT_SIZES.large};
  outline: none;
  transition: background-color 0.3s;

  ${(props): string =>
    props.negative
      ? `
      background-color: ${polkadotOfficialTheme.white};
      color: ${polkadotOfficialTheme.signal}`
      : ''};

  :hover {
    opacity: 0.9;
    cursor: ${(props): string => (props.disabled ? 'not-allowed' : 'pointer')};
  }
  & p {
    padding: 0.5em 2.5em;
  }
`;

export const VoteNayButton = styled.button`
  background-image: linear-gradient(
    107deg,
    ${polkadotOfficialTheme.hotPink},
    ${polkadotOfficialTheme.hotPink}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${polkadotOfficialTheme.black}, 0.3);
  color: ${polkadotOfficialTheme.white};
  fontsize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const VoteYayButton = styled.button`
  background-image: linear-gradient(
    107deg,
    ${polkadotOfficialTheme.lightBlue1},
    ${polkadotOfficialTheme.lightBlue2}
  );
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px 0 rgba(${polkadotOfficialTheme.black}, 0.3);
  color: ${polkadotOfficialTheme.white};
  fontsize: ${FONT_SIZES.large};
  height: 21px;
  width: 51px;

  :hover {
    cursor: pointer;
  }
`;

export const Stacked = styled.div<StackProps>`
  align-items: ${(props): string => props.alignItems || ''};
  display: flex;
  flex-direction: column;
  justify-content: ${(props): string => props.justifyContent || 'center'};
`;

export const StackedHorizontal = styled.div<StackProps>`
  align-items: ${(props): string => props.alignItems || 'center'};
  display: flex;
  flex-direction: row;
  justify-content: ${(props): string => props.justifyContent || ''};

  @media (max-width: ${(props): number | string => props.wrapAt || '0'}em) {
    flex-wrap: wrap;
  }
`;

export const SubHeader = styled.h3<SubHeaderProps>`
  color: ${polkadotOfficialTheme.black};
  font-weight: 500;
  font-size: ${FONT_SIZES.medium};
  margin: ${(props): string =>
    props.margin ? '1rem auto 0.3rem auto' : '0 0'};
  text-align: ${(props): string => props.textAlign || 'left'};
`;

export const InlineSubHeader = styled(SubHeader)`
  display: inline;
`;

export const WrapperDiv = styled.div<WrapperDivProps>`
  margin: ${(props): string => props.margin || 'auto'};
  padding: ${(props): string => props.padding || '1rem'};
  width: ${(props): string => props.width || 'auto'};
  height: ${(props): string => props.height || '100%'};
`;

/* TODO compomnent with actions */
export const FramedBlock = styled.div`
  padding: 2rem;
  position: relative;
  border-style: solid;
  border-width: 1px;
`;
export const BlackBlock = styled.div`
  background-color: ${polkadotOfficialTheme.black};
  color: ${polkadotOfficialTheme.white};
`;
export const NodesBlock = styled.span<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
  position: relative;
  color: inherit important!;
`;
export const NodeSelector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '100%' : '')};
`;
export const NodesConnector = styled.div<NodeSelectorProps>`
  width: ${(props): string => (props.fluid ? '50%' : '100px')};
  transform: translateY(-50%);
  min-width: 2rem;
`;
