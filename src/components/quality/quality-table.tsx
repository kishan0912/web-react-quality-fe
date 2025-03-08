"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "../ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { createAuthenticatedAxiosInstance } from "@/utils/protected-axios";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { MACHINE, MainQuality, QUALITY } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "../shared/delete-dailog";
import { Checkbox } from "../ui/checkbox";
import CellWrapper from "./cell-wrapper";
import useGetSelfInfo from "@/hooks/use-self";

type Props = {
  data: QUALITY[];
  token: string;
  setIsReloaded: React.Dispatch<React.SetStateAction<boolean>>;
};

export function QualityDataTable({ data, token, setIsReloaded }: Props) {
  

  const [selectedMachine, setSelectedMachine] = React.useState<
    QUALITY | undefined
  >(undefined);

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [rowSelected, setRowSelected] = React.useState<undefined | QUALITY>(
    undefined
  );

  const axiosInstance = createAuthenticatedAxiosInstance({}, token);

  let columns: ColumnDef<QUALITY>[] = [
    {
      id: "select",
      header: ({ table }) => <></>,
      cell: ({ row }) => (
        <div>
          <Button
            onClick={() => {
              if (row.original.id !== rowSelected?.id || !rowSelected) {
                setRowSelected(row.original);
                row.toggleSelected(true);
              } else {
                setRowSelected(undefined);
                row.toggleSelected(undefined);
              }
            }}
            size={"icon"}
            variant={"outline"}
          >
            {row.getIsSelected() ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "tag_name",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tag Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.original.tag_name}</div>,
    },
    {
      accessorKey: "counter_reading",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Counter Reading
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="w-[100px]">
          {<Badge variant={"secondary"}>{row.original.counter_reading}</Badge>}
        </div>
      ),
    },
    {
      accessorKey: "calculated_quantity_quintal",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Calculated Quantity <br /> (Quintal)
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="">{row.original.calculated_quantity_quintal}</div>
        );
      },
    },
    {
      accessorKey: "last_approved_quantity",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Approved <br />
            Quantity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="">
              <CellWrapper
                inputText={
                  row.original.last_approved_quantity.toString() || ""
                }
                type={"number"}
                row={row}
              />
            
          </div>
        );
      },
    },
    {
      accessorKey: "qa_approved_quantity",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            QA Approved
            <br /> Quantity
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="">
              <CellWrapper
                inputText={row.original.qa_approved_quantity.toString() || ""}
                type={"number"}
                row={row}
              />
          </div>
        );
      },
    },
    {
      accessorKey: "calculated_quality_last_reading_time",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Calculated Quantity <br />
            Reading Time
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="">{row.original.calculated_quality_last_reading_time}</div>
        );
      },
    },
    {
      accessorKey: "qa_approved_quality_last_approved_time",
      header: ({ column }) => {
        return (
          <Button
            className=" cursor-pointer"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            QA Approved Quantity <br />
            Reading Time
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div className="">{row.original.qa_approved_quality_last_approved_time}</div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger className=" cursor-pointer" asChild>
              <Button variant={"outline"}>...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setOpenDeleteDialog(true);
                  setSelectedMachine(row.original);
                }}
                variant="default"
                className="w-full flex items-center justify-between cursor-pointer"
              >
                Delete <Trash />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const deleteHandler = async (id: string) => {
    try {
    } catch (error) {}
  };

  return (
    <div className="w-full">

      <div className="">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className=" font-semibold" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  {/* Main Quality Row */}
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => setRowSelected(row.original)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>

                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {openDeleteDialog && selectedMachine && (
        <DeleteDialog
          id={selectedMachine.id}
          open={openDeleteDialog}
          setOpen={setOpenDeleteDialog}
          deleteHandler={deleteHandler}
        />
      )}
    </div>
  );
}







// {/* Sub Qualities as Child Rows */}
// {row.getIsSelected() &&
//   rowSelected &&
//   rowSelected.id === row.original.id &&
//   rowSelected.subQualities.map((subQuality, index) => (
//     <TableRow key={`sub-${index}`} className="bg-gray-100">
//       {/* Empty Cell for Checkbox Column */}
//       <TableCell></TableCell>

//       {/* Sub Quality Data Columns */}
//       <TableCell className="pl-6 font-semibold">
//         {subQuality.tagName} (Sub Quality)
//       </TableCell>
//       <TableCell>{subQuality.counter_reading}</TableCell>
//       <TableCell>
//         {subQuality.c}
//       </TableCell>
//       <TableCell>
//         <CellWrapper
//           inputText={
//             subQuality.lastApprovedQuantity.toString() || ""
//           }
//           type={"number"}
//           row={row}
//         />
//       </TableCell>
//       <TableCell>
//         <CellWrapper
//           inputText={
//             subQuality.QaApprovedQuantity.toString() || ""
//           }
//           type={"number"}
//           row={row}
//         />
//       </TableCell>
//       <TableCell>
//         {subQuality.calculatedQualityReadingTime}
//       </TableCell>
//       <TableCell>
//         {subQuality.lastApprovedQualityReadingTime}
//       </TableCell>

//       {/* Empty Cell for Actions Column */}
//       <TableCell></TableCell>
//     </TableRow>
//   ))}