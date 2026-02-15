"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	MenuItem,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Box from "@mui/material/Box";

interface Props {
	open: boolean;
	onClose: () => void;
	userId: string;
	onSuccess: () => void;
}

export default function CreateContentModal({
	open,
	onClose,
	userId,
	onSuccess,
}: Props) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [categoryId, setCategoryId] = useState(1);
	const [file, setFile] = useState<File | null>(null);

	const handleSubmit = async () => {
		console.log("SUBMIT CLICKED");
		let filePath: string | null = null;

		// STEP A — Upload file jika ada
		if (file) {
			const fileName = `${Date.now()}-${file.name}`;

			const { data, error: uploadError } = await supabase.storage
				.from("content-files")
				.upload(fileName, file);

			if (uploadError) {
				console.error("UPLOAD ERROR:", uploadError.message);
				return;
			}

			filePath = data.path;
		}

		// STEP B — Insert ke database
		const { error } = await supabase.from("contents").insert({
			title,
			body,
			status: "draft",
			author_id: userId,
			category_id: categoryId,
			file_path: filePath,
		});

		if (error) {
			console.error("INSERT ERROR:", error.message);
			return;
		}

		onSuccess();
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>Buat Konten Baru</DialogTitle>
			<DialogContent>
				<TextField
					fullWidth
					label="Judul"
					margin="normal"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<TextField
					fullWidth
					label="Isi"
					margin="normal"
					multiline
					rows={4}
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/>
				<TextField
					select
					fullWidth
					label="Kategori"
					margin="normal"
					value={categoryId}
					onChange={(e) => setCategoryId(Number(e.target.value))}
				>
					<MenuItem value={1}>Health</MenuItem>
					<MenuItem value={2}>Technology</MenuItem>
					<MenuItem value={3}>Finance</MenuItem>
				</TextField>
				<Box
					sx={{
						border: "2px dashed #cbd5e1",
						borderRadius: 2,
						p: 3,
						mt: 2,
						textAlign: "center",
						cursor: "pointer",
						backgroundColor: "#f8fafc",
						"&:hover": {
							backgroundColor: "#f1f5f9",
						},
					}}
				>
					<label style={{ cursor: "pointer" }}>
						<CloudUploadIcon sx={{ fontSize: 40, color: "#2563eb" }} />
						<Typography variant="body2" sx={{ mt: 1 }}>
							Klik untuk upload file
						</Typography>

						<input
							type="file"
							hidden
							onChange={(e) => setFile(e.target.files?.[0] || null)}
						/>
					</label>

					{file && (
						<Typography variant="caption" sx={{ display: "block", mt: 1 }}>
							File dipilih: {file.name}
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Batal</Button>
				<Button onClick={handleSubmit} variant="contained">
					Simpan
				</Button>
			</DialogActions>
		</Dialog>
	);
}
