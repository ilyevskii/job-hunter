import { ColumnDef } from '@tanstack/react-table';
import { ComboboxItem } from '@mantine/core';

import { JobWithEmployer } from 'types';

export const PER_PAGE = 5;

export const columns: ColumnDef<JobWithEmployer>[] = [
  {
    accessorKey: 'id',
    header: '№',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'companyName',
    header: 'Company name',
    cell: (info) => info.cell.row.original.employer.name,
  },
  {
    accessorKey: 'location',
    header: 'Location',
    cell: (info) => info.cell.row.original.location,
  },
];

export const selectOptions: ComboboxItem[] = [
  {
    value: 'newest',
    label: 'Newest',
  },
  {
    value: 'oldest',
    label: 'Oldest',
  },
];
