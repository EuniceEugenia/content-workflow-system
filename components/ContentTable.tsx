"use client";

import {
	useReactTable,
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
	SortingState,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	TableContainer,
	Typography,
	TextField,
	TablePagination,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from "@mui/material";

import { useState, useMemo } from "react";

interface Content {
	id: string;
	title: string;
	status: string;
	created_at: string;
}

export default function ContentTable({ data }: { data: Content[] }) {
	const [globalFilter, setGlobalFilter] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);

	const columns = useMemo<ColumnDef<Content>[]>(
		() => [
			{
				accessorKey: "title",
				header: "Judul",
			},
			{
				accessorKey: "status",
				header: "Status",
			},
			{
				accessorKey: "created_at",
				header: "Tanggal",
				cell: ({ row }) => row.original.created_at.split("T")[0],
			},
		],
		[],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			globalFilter,
			sorting,
		},
		onGlobalFilterChange: setGlobalFilter,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	const handleSortChange = (value: string) => {
		switch (value) {
			case "newest":
				setSorting([{ id: "created_at", desc: true }]);
				break;
			case "oldest":
				setSorting([{ id: "created_at", desc: false }]);
				break;
			case "title-asc":
				setSorting([{ id: "title", desc: false }]);
				break;
			case "title-desc":
				setSorting([{ id: "title", desc: true }]);
				break;
			case "status":
				setSorting([{ id: "status", desc: false }]);
				break;
			default:
				setSorting([]);
		}
	};

	if (!data || data.length === 0) {
		return <Typography variant="body2">Data konten belum tersedia.</Typography>;
	}

	return (
		<>
			{/* SEARCH */}
			<TextField
				fullWidth
				placeholder="Search..."
				value={globalFilter}
				onChange={(e) => setGlobalFilter(e.target.value)}
				sx={{ mb: 2 }}
			/>

			{/* SORT DROPDOWN */}
			<FormControl size="small" sx={{ minWidth: 200, mb: 2 }}>
				<InputLabel>Sort By</InputLabel>
				<Select
					label="Sort By"
					defaultValue="newest"
					onChange={(e) => handleSortChange(e.target.value)}
				>
					<MenuItem value="newest">Terbaru</MenuItem>
					<MenuItem value="oldest">Terlama</MenuItem>
					<MenuItem value="title-asc">Judul A–Z</MenuItem>
					<MenuItem value="title-desc">Judul Z–A</MenuItem>
					<MenuItem value="status">Status A–Z</MenuItem>
				</Select>
			</FormControl>

			<TableContainer component={Paper} elevation={0}>
				<Table>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell key={header.id} sx={{ fontWeight: "bold" }}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>

					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell ??
												cell.column.columnDef.accessorKey,
											cell.getContext(),
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* PAGINATION */}
			<TablePagination
				component="div"
				count={table.getFilteredRowModel().rows.length}
				page={table.getState().pagination.pageIndex}
				onPageChange={(_, page) => table.setPageIndex(page)}
				rowsPerPage={table.getState().pagination.pageSize}
				onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
				rowsPerPageOptions={[5, 10, 20]}
			/>
		</>
	);
}