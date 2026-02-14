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
							<TableCell>
								{new Date(row.created_at).toLocaleDateString("id-ID")}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
