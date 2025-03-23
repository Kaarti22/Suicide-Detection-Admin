"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Timestamp } from "firebase/firestore";

interface Vital {
  id: string;
  patientId: string;
  bloodRate: number;
  SpO2: number;
  temperature: number;
  prediction: boolean;
  timestamp: Timestamp;
}

interface DataTableProps {
  vitals: Vital[];
}

const columns: ColumnDef<Vital>[] = [
  {
    accessorKey: "timestamp",
    header: "Timestamp",
    cell: ({ row }) => {
      const timestamp: Timestamp = row.getValue("timestamp");
      return new Date(timestamp.seconds * 1000).toLocaleString();
    },
  },
  {
    accessorKey: "heartRate",
    header: "Heart Rate",
    cell: ({ row }) => row.getValue("heartRate"),
  },
  {
    accessorKey: "SpO2",
    header: "SpO2",
    cell: ({ row }) => row.getValue("SpO2"),
  },
  {
    accessorKey: "temperature",
    header: "Temperature",
    cell: ({ row }) => row.getValue("temperature"),
  },
  {
    accessorKey: "prediction",
    header: "Prediction",
    cell: ({ row }) => (row.getValue("prediction") ? "Abnormal" : "Normal"),
  },
];

const DataTable: React.FC<DataTableProps> = ({ vitals }) => {
  const table = useReactTable({
    data: vitals,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;
