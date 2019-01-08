// Copyright 2017-2018 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SemanticICONS } from 'semantic-ui-react/dist/commonjs';
import { RouteComponentProps } from 'react-router';

export type RouteProps = RouteComponentProps & {
  basePath: string
};

export type Route = {
  Component: React.ComponentType<RouteProps>,
  icon: SemanticICONS,
  isApiGated: boolean,
  isHidden: boolean,
  name: string
};

export type Routes = Array<Route | null>;

export type Routing = {
  default: string,
  routes: Routes
};
