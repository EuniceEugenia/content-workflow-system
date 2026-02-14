"use client";

import {
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
	Button,
	MenuItem,
} from "@mui/material";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

	const handleSubmit = async () => {
		const { error } = await supabase.from("contents").insert({
			title,
			body,
			status: "draft",
			author_id: userId,
			category_id: categoryId,
		});

		if (error) {
			console.error("INSERT ERROR:", error.message);
			console.error("FULL ERROR OBJECT:", error);
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
