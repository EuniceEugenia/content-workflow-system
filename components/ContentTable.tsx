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
	Button,
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

export default function ContentTable({
	data,
	onDelete,
	onEdit,
}: {
	data: Content[];
	onDelete: (id: string) => void;
	onEdit?: (content: Content) => void;
}) {
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
						<TableCell>Aksi</TableCell>
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
							<TableCell>
								<Button
									variant="outlined"
									size="small"
									onClick={() => onEdit && onEdit(row)}
									sx={{ mr: 1 }}
								>
									Edit
								</Button>
								
								<Button
									color="error"
									variant="outlined"
									size="small"
									onClick={() => onDelete(row.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
