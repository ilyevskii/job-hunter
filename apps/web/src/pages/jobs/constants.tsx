import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ComboboxItem, Button } from '@mantine/core';

import { JobWithEmployer } from 'types';
import { RoutePath } from '../../routes';

export const PER_PAGE = 5;

export const columns: ColumnDef<JobWithEmployer>[] = [
  {
    accessorKey: 'id',
    enableSorting: true,
    header: '№',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'title',
    enableSorting: true,
    header: 'Title',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'companyName',
    enableSorting: true,
    header: 'Company name',
    cell: (info) => info.cell.row.original.employer.name,
  },
  {
    accessorKey: 'salaryFrom',
    enableSorting: true,
    header: 'Salary',
    cell: (info) => `${info.cell.row.original.salaryFrom} - ${info.cell.row.original.salaryTo} $`,
  },
  {
    accessorKey: 'location',
    enableSorting: true,
    header: 'Location',
    cell: (info) => info.cell.row.original.location,
  },
  {
    id: 'moreInfo',
    header: '',
    cell: (info) => (
      <Button
        component={Link}
        href={`${RoutePath.Jobs}/${info.cell.row.original.id}`}
        size="sm"
        fullWidth
      >
        More info
      </Button>
    ),
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
