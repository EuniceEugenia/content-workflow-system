"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	TableContainer,
	Typography,
} from "@mui/material";

interface Content {
	id: string;
	title: string;
	status: string;
	created_at: string;
}

const formatDate = (date: string) => {
	return date.split("T")[0];
};

export default function ContentTable({ data }: { data: Content[] }) {
	if (!data || data.length === 0) {
		return <Typography variant="body2">Data konten belum tersedia.</Typography>;
	}

	return (
		<TableContainer component={Paper} elevation={0}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Judul</TableCell>
						<TableCell>Status</TableCell>
						<TableCell>Tanggal</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.id}>
							<TableCell>{row.title}</TableCell>
							<TableCell>{row.status}</TableCell>
							<TableCell>{formatDate(row.created_at)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
