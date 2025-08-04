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
import { formatWeiToEther, formatWeiToGigawei } from '../../utils/ether';

// EXISTING_CODE

// Column configurations for the Exports data facets

export const getColumns = (dataFacet: types.DataFacet): FormField[] => {
  switch (dataFacet) {
    case types.DataFacet.STATEMENTS:
      return getStatementsColumns();
    case types.DataFacet.BALANCES:
      return getBalancesColumns();
    case types.DataFacet.ASSETS:
      return getAssetsColumns();
    default:
      return [];
  }
};

const getAssetsColumns = (): FormField[] => [
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
    key: 'symbol',
    name: 'symbol',
    header: 'Symbol',
    label: 'Symbol',
    type: 'text',
    width: '200px',
  },
  {
    key: 'decimals',
    name: 'decimals',
    header: 'Decimals',
    label: 'Decimals',
    type: 'number',
    width: '120px',
  },
  {
    key: 'source',
    name: 'source',
    header: 'Source',
    label: 'Source',
    type: 'text',
    width: '200px',
  },
  {
    key: 'tags',
    name: 'tags',
    header: 'Tags',
    label: 'Tags',
    type: 'text',
    width: '200px',
  },
];

const getBalancesColumns = (): FormField[] => [
  // EXISTING_CODE
  // EXISTING_CODE
  {
    key: 'blockNumber',
    name: 'blockNumber',
    header: 'Block Number',
    label: 'Block Number',
    type: 'number',
    width: '120px',
  },
  {
    key: 'transactionIndex',
    name: 'transactionIndex',
    header: 'Transaction Index',
    label: 'Transaction Index',
    type: 'number',
    width: '120px',
  },
  {
    key: 'holder',
    name: 'holder',
    header: 'Holder',
    label: 'Holder',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
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
    key: 'symbol',
    name: 'symbol',
    header: 'Symbol',
    label: 'Symbol',
    type: 'text',
    width: '200px',
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
    key: 'balance',
    name: 'balance',
    header: 'Balance',
    label: 'Balance',
    type: 'ether',
    width: '120px',
  },
  {
    key: 'priorBalance',
    name: 'priorBalance',
    header: 'Prior Balance',
    label: 'Prior Balance',
    type: 'ether',
    width: '120px',
    render: renderPriorBalance,
  },
  {
    key: 'decimals',
    name: 'decimals',
    header: 'Decimals',
    label: 'Decimals',
    type: 'number',
    width: '120px',
  },
  {
    key: 'actions',
    name: 'actions',
    header: 'Actions',
    label: 'Actions',
    type: 'text',
    width: '120px',
  },
];

const getStatementsColumns = (): FormField[] => [
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
    key: 'asset',
    name: 'asset',
    header: 'Asset',
    label: 'Asset',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
  {
    key: 'symbol',
    name: 'symbol',
    header: 'Symbol',
    label: 'Symbol',
    type: 'text',
    width: '200px',
  },
  {
    key: 'decimals',
    name: 'decimals',
    header: 'Decimals',
    label: 'Decimals',
    type: 'value',
    width: '120px',
  },
  {
    key: 'spotPrice',
    name: 'spotPrice',
    header: 'Spot Price',
    label: 'Spot Price',
    type: 'float',
    width: '120px',
  },
  {
    key: 'priceSource',
    name: 'priceSource',
    header: 'Price Source',
    label: 'Price Source',
    type: 'text',
    width: '200px',
  },
  {
    key: 'accountedFor',
    name: 'accountedFor',
    header: 'Accounted For',
    label: 'Accounted For',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
  {
    key: 'sender',
    name: 'sender',
    header: 'Sender',
    label: 'Sender',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
  {
    key: 'recipient',
    name: 'recipient',
    header: 'Recipient',
    label: 'Recipient',
    type: 'address',
    width: '340px',
    readOnly: true,
  },
  {
    key: 'begBal',
    name: 'begBal',
    header: 'Beg Bal',
    label: 'Beg Bal',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'amountNet',
    name: 'amountNet',
    header: 'Amount Net',
    label: 'Amount Net',
    type: 'int256',
    width: '120px',
    render: renderAmountNet,
  },
  {
    key: 'endBal',
    name: 'endBal',
    header: 'End Bal',
    label: 'End Bal',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'reconciled',
    name: 'reconciled',
    header: 'Reconciled',
    label: 'Reconciled',
    type: 'checkbox',
    width: '80px',
  },
  {
    key: 'totalIn',
    name: 'totalIn',
    header: 'Total In',
    label: 'Total In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'amountIn',
    name: 'amountIn',
    header: 'Amount In',
    label: 'Amount In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'internalIn',
    name: 'internalIn',
    header: 'Internal In',
    label: 'Internal In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'selfDestructIn',
    name: 'selfDestructIn',
    header: 'Self Destruct In',
    label: 'Self Destruct In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'minerBaseRewardIn',
    name: 'minerBaseRewardIn',
    header: 'Miner Base Reward In',
    label: 'Miner Base Reward In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'minerNephewRewardIn',
    name: 'minerNephewRewardIn',
    header: 'Miner Nephew Reward In',
    label: 'Miner Nephew Reward In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'minerTxFeeIn',
    name: 'minerTxFeeIn',
    header: 'Miner Tx Fee In',
    label: 'Miner Tx Fee In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'minerUncleRewardIn',
    name: 'minerUncleRewardIn',
    header: 'Miner Uncle Reward In',
    label: 'Miner Uncle Reward In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctBegBalIn',
    name: 'correctBegBalIn',
    header: 'Correct Beg Bal In',
    label: 'Correct Beg Bal In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctAmountIn',
    name: 'correctAmountIn',
    header: 'Correct Amount In',
    label: 'Correct Amount In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctEndBalIn',
    name: 'correctEndBalIn',
    header: 'Correct End Bal In',
    label: 'Correct End Bal In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'prefundIn',
    name: 'prefundIn',
    header: 'Prefund In',
    label: 'Prefund In',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'totalOut',
    name: 'totalOut',
    header: 'Total Out',
    label: 'Total Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'amountOut',
    name: 'amountOut',
    header: 'Amount Out',
    label: 'Amount Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'internalOut',
    name: 'internalOut',
    header: 'Internal Out',
    label: 'Internal Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctBegBalOut',
    name: 'correctBegBalOut',
    header: 'Correct Beg Bal Out',
    label: 'Correct Beg Bal Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctAmountOut',
    name: 'correctAmountOut',
    header: 'Correct Amount Out',
    label: 'Correct Amount Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctEndBalOut',
    name: 'correctEndBalOut',
    header: 'Correct End Bal Out',
    label: 'Correct End Bal Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'selfDestructOut',
    name: 'selfDestructOut',
    header: 'Self Destruct Out',
    label: 'Self Destruct Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'gasOut',
    name: 'gasOut',
    header: 'Gas Out',
    label: 'Gas Out',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'prevBal',
    name: 'prevBal',
    header: 'Prev Bal',
    label: 'Prev Bal',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'begBalDiff',
    name: 'begBalDiff',
    header: 'Beg Bal Diff',
    label: 'Beg Bal Diff',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'endBalDiff',
    name: 'endBalDiff',
    header: 'End Bal Diff',
    label: 'End Bal Diff',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'endBalCalc',
    name: 'endBalCalc',
    header: 'End Bal Calc',
    label: 'End Bal Calc',
    type: 'int256',
    width: '120px',
  },
  {
    key: 'correctingReasons',
    name: 'correctingReasons',
    header: 'Correcting Reasons',
    label: 'Correcting Reasons',
    type: 'text',
    width: '200px',
  },
];

export function renderAmountNet(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    const amountIn = BigInt((row.amountIn as string) || '0');
    const amountOut = BigInt((row.amountOut as string) || '0');
    const netAmount = amountIn + amountOut;
    return formatWeiToEther(netAmount.toString());
    // EXISTING_CODE
  }
  return '';
}

export function renderArticulatedLog(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    const log = row['articulatedLog'] as unknown as types.Function;
    return log?.name;
    // EXISTING_CODE
  }
  return '';
}

export function renderCompressedTrace(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    return 'renderCompressedTrace';
    // EXISTING_CODE
  }
  return '';
}

export function renderCompressedTx(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    return 'renderCompressedTx';
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
    if (blockNumber !== undefined) parts.push(`Block: ${blockNumber}`);
    if (transactionIndex !== undefined)
      parts.push(`TxIdx: ${transactionIndex}`);
    if (transactionHash) parts.push(`Tx: ${transactionHash.slice(0, 10)}…`);
    if (blockHash) parts.push(`BlkHash: ${blockHash.slice(0, 10)}…`);
    if (node) parts.push(`Node: ${node}`);

    return [dateStr, ...parts].join(' | ');
    // EXISTING_CODE
  }
  return '';
}

export function renderEther(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    return 'renderEther';
    // EXISTING_CODE
  }
  return '';
}

export function renderGasCost(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    const gas = BigInt((row.gas as string) || '0');
    const gasPrice = BigInt((row.gasPrice as string) || '0');
    const gasCost = gas * gasPrice;
    return formatWeiToGigawei(gasCost.toString());
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

export function renderPriorBalance(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    const balance = (row.priorBalance as string) || '0';
    return formatWeiToEther(balance);
    // EXISTING_CODE
  }
  return '';
}

export function renderStatements(row: Record<string, unknown>) {
  if (row != null) {
    // EXISTING_CODE
    return 'renderStatements';
    // EXISTING_CODE
  }
  return '';
}

// EXISTING_CODE
