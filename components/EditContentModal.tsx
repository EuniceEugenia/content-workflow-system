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
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Content {
	id: string;
	title: string;
	body?: string;
	category_id?: number;
}

interface Props {
	open: boolean;
	onClose: () => void;
	content: Content | null;
	onSuccess: () => void;
}

export default function EditContentModal({
	open,
	onClose,
	content,
	onSuccess,
}: Props) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [categoryId, setCategoryId] = useState<number>(1);

	// Prefill ketika modal dibuka
	useEffect(() => {
		if (content) {
			setTitle(content.title);
			setBody(content.body || "");
			setCategoryId(content.category_id || 1);
		}
	}, [content]);

	const handleUpdate = async () => {
		if (!content) return;

		const { error } = await supabase
			.from("contents")
			.update({
				title,
				body,
				category_id: categoryId,
			})
			.eq("id", content.id);

		if (error) {
			console.error("UPDATE ERROR:", error.message);
			return;
		}

		onSuccess();
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth>
			<DialogTitle>Edit Konten</DialogTitle>
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
				<Button onClick={handleUpdate} variant="contained">
					Update
				</Button>
			</DialogActions>
		</Dialog>
	);
}