import React from 'react';

import { project } from '@models';
import { usePagination } from 'src/components/table/usePagination';

import './Stats.css';

// StatsProps defines the props for the Stats component.
interface StatsProps {
  namesLength: number;
  viewStateKey: project.ViewStateKey;
}

// Stats displays a summary of the current entries being shown in the table.
export const Stats = ({ namesLength, viewStateKey }: StatsProps) => {
  const { pagination } = usePagination(viewStateKey);
  const { currentPage, pageSize, totalItems } = pagination;
  return (
    <div className="showing-entries">
      Showing {currentPage * pageSize + (namesLength > 0 ? 1 : 0)} to{' '}
      {Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems}{' '}
      entries
    </div>
  );
};
