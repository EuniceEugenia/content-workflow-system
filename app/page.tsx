"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase";

import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	Alert,
	CircularProgress,
	InputAdornment,
	IconButton,
} from "@mui/material";

import { LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
	// ===== State =====
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// ===== Login Handler =====
	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			setError(error.message);
			setLoading(false);
			return;
		}

		// Redirect setelah login sukses
		console.log("Login success:", data);
		window.location.href = "/dashboard";
	};

	return (
		<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
			<Container maxWidth="xs">
				<Paper
					elevation={0}
					className="p-8 rounded-3xl border border-slate-200 shadow-2xl shadow-slate-200/50 bg-white"
				>
					{/* Header */}
					<Box className="flex flex-col items-center mb-8">
						<div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/30">
							<LockKeyhole size={28} />
						</div>
						<Typography variant="h5" className="font-black text-slate-800">
							Content Workflow System
						</Typography>
						<Typography variant="body2" className="text-slate-500 text-center">
							Masuk untuk mengelola alur kerja konten
						</Typography>
					</Box>

					{/* Error Alert */}
					{error && (
						<Alert
							severity="error"
							variant="filled"
							className="mb-6 rounded-xl"
						>
							{error}
						</Alert>
					)}

					{/* Login Form */}
					<form onSubmit={handleLogin} className="space-y-5">
						<TextField
							fullWidth
							label="Email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							disabled={loading}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Mail size={20} />
									</InputAdornment>
								),
							}}
							sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
						/>

						<TextField
							fullWidth
							label="Password"
							type={showPassword ? "text" : "password"}
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							disabled={loading}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											onClick={() => setShowPassword(!showPassword)}
											edge="end"
										>
											{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
										</IconButton>
									</InputAdornment>
								),
							}}
							sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
						/>

						<Button
							fullWidth
							variant="contained"
							type="submit"
							size="large"
							disabled={loading}
							className="bg-blue-600 hover:bg-blue-700 py-4 rounded-xl normal-case font-bold"
						>
							{loading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					{/* Footer */}
					<Box className="mt-10 pt-6 border-t border-slate-100 text-center">
						<Typography variant="caption" className="text-slate-400">
							© 2026 Content Workflow System · Built with Next.js & Supabase
						</Typography>
					</Box>
				</Paper>
			</Container>
		</div>
	);
}
