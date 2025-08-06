// Copyright 2016, 2026 The TrueBlocks Authors. All rights reserved.
// Use of this source code is governed by a license that can
// be found in the LICENSE file.
/*
 * Parts of this file were auto generated. Edit only those parts of
 * the code inside of 'EXISTING_CODE' tags.
 */
import { FormField } from '@components';
import { types } from '@models';

// EXISTING_CODE
// EXISTING_CODE

// Column configurations for the Contracts data facets

export const getColumns = (dataFacet: types.DataFacet): FormField[] => {
  switch (dataFacet) {
    case types.DataFacet.DASHBOARD:
      return getContractsColumns();
    case types.DataFacet.EXECUTE:
      return getContractsColumns();
    case types.DataFacet.EVENTS:
      return getLogsColumns();
    default:
      return [];
  }
};

const getContractsColumns = (): FormField[] => [
  // EXISTING_CODE
  // EXISTING_CODE
  {
    key: 'address',
    name: 'address',
    header: 'Address',
    label: 'Address',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
  {
    key: 'name',
    name: 'name',
    header: 'Name',
    label: 'Name',
    type: 'text',
    width: '200px',
  },
  {
    key: 'lastUpdated',
    name: 'lastUpdated',
    header: 'Last Updated',
    label: 'Last Updated',
    type: 'timestamp',
    width: '120px',
  },
  {
    key: 'date',
    name: 'date',
    header: 'Date',
    label: 'Date',
    type: 'datetime',
    width: '120px',
  },
  {
    key: 'errorCount',
    name: 'errorCount',
    header: 'Error Count',
    label: 'Error Count',
    type: 'number',
    width: '80px',
  },
];

const getLogsColumns = (): FormField[] => [
  // EXISTING_CODE
  // EXISTING_CODE
  {
    key: 'date',
    name: 'date',
    header: 'Date',
    label: 'Date',
    type: 'datetime',
    width: '120px',
    render: renderDate,
  },
  {
    key: 'address',
    name: 'address',
    header: 'Address',
    label: 'Address',
    type: 'address',
    width: '340px',
  },
  {
    key: 'name',
    name: 'name',
    header: 'Name',
    label: 'Name',
    type: 'text',
    width: '200px',
    render: renderName,
  },
  {
    key: 'articulatedLog',
    name: 'articulatedLog',
    header: 'Articulated Log',
    label: 'Articulated Log',
    type: 'Function',
    width: '120px',
    render: renderArticulatedLog,
  },
];

export function renderArticulatedLog(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    const log = row['articulatedLog'] as unknown as types.Function;
    return log?.name;
    // EXISTING_CODE
  }
  return '';
}

export function renderDate(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    var timestamp = row.timestamp as string | number | undefined;
    if (timestamp === undefined) {
      if (row.transaction) {
        const tx = row.transaction as types.Transaction | undefined;
        if (tx != null) {
          timestamp = tx.timestamp as string | number | undefined;
        }
      }
    }
    const blockNumber = row.blockNumber as string | number | undefined;
    const transactionIndex = row.transactionIndex as
      | string
      | number
      | undefined;
    const transactionHash = row.transactionHash as string | undefined;
    const blockHash = row.blockHash as string | undefined;
    const node = row.node as string | undefined;

    // Format date
    let dateStr = '';
    if (timestamp) {
      const date = new Date(Number(timestamp) * 1000);
      dateStr = date.toISOString().replace('T', ' ').substring(0, 19);
    }

    // Compose extra info
    const parts: string[] = [];
    if (blockNumber !== undefined) parts.push(` ${blockNumber}`);
    if (transactionIndex !== undefined) parts.push(`${transactionIndex}`);
    if (transactionHash) parts.push(`${transactionHash.slice(0, 10)}…`);
    if (blockHash) parts.push(`${blockHash.slice(0, 10)}…`);
    if (node) parts.push(`${node}`);
    return [dateStr, ...parts].join(' | ');
    // EXISTING_CODE
  }
  return '';
}

export function renderName(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    // EXISTING_CODE
  }
  return '';
}

// EXISTING_CODE
