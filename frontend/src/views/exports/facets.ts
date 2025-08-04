// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * This file was auto generated. Do not edit.
 */
import { DataFacetConfig } from '@hooks';
import { types } from '@models';
import { toProperCase } from 'src/utils/toProper';

export const exportsFacets: DataFacetConfig[] = [
  {
    id: types.DataFacet.STATEMENTS,
    label: toProperCase(types.DataFacet.STATEMENTS),
  },
  {
    id: types.DataFacet.BALANCES,
    label: toProperCase(types.DataFacet.BALANCES),
  },
  {
    id: types.DataFacet.TRANSFERS,
    label: toProperCase(types.DataFacet.TRANSFERS),
  },
  {
    id: types.DataFacet.TRANSACTIONS,
    label: toProperCase(types.DataFacet.TRANSACTIONS),
  },
  {
    id: types.DataFacet.WITHDRAWALS,
    label: toProperCase(types.DataFacet.WITHDRAWALS),
  },
  {
    id: types.DataFacet.ASSETS,
    label: toProperCase(types.DataFacet.ASSETS),
  },
  {
    id: types.DataFacet.LOGS,
    label: toProperCase(types.DataFacet.LOGS),
  },
  {
    id: types.DataFacet.TRACES,
    label: toProperCase(types.DataFacet.TRACES),
  },
  {
    id: types.DataFacet.RECEIPTS,
    label: toProperCase(types.DataFacet.RECEIPTS),
  },
];
