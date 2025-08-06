// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
import { DataFacetConfig } from '@hooks';
import { types } from '@models';
import { toProperCase } from 'src/utils/toProper';

export const contractsFacets: DataFacetConfig[] = [
  {
    id: types.DataFacet.DASHBOARD,
    label: toProperCase(types.DataFacet.DASHBOARD),
  },
  {
    id: types.DataFacet.EXECUTE,
    label: toProperCase(types.DataFacet.EXECUTE),
  },
  {
    id: types.DataFacet.EVENTS,
    label: toProperCase(types.DataFacet.EVENTS),
  },
];
