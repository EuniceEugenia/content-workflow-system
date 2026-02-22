"use client";

import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

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
	const router = useRouter();
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

		if (data.user) {
			console.log("REDIRECTING...");
			window.location.href = "/dashboard";
		}
	};

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 flex items-center justify-center p-6 overflow-hidden">
			<div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl"></div>
			<div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/30 rounded-full blur-3xl"></div>
			<Container maxWidth="xs">
				<Paper
					elevation={0}
					sx={{
						background: "rgba(255,255,255,0.35)",
						backdropFilter: "blur(20px)",
						WebkitBackdropFilter: "blur(20px)",
						border: "1px solid rgba(255,255,255,0.3)",
						boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
					}}
					className="p-10 rounded-3xl shadow-2xl"
				>
					{/* Header */}
					<Box className="flex flex-col items-center mb-10">
						<div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white mb-4 shadow-xl shadow-blue-500/30 ring-4 ring-white/40">
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
					<form onSubmit={handleLogin} className="flex flex-col gap-4 mt-4">
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
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "14px",
									backgroundColor: "rgba(255,255,255,0.6)",
									backdropFilter: "blur(6px)",
									transition: "all 0.3s ease",
								},
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: "rgba(148,163,184,0.4)",
								},
								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: "#3b82f6",
								},
								"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2563eb",
								},
							}}
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
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: "14px",
									backgroundColor: "rgba(255,255,255,0.6)",
									backdropFilter: "blur(6px)",
									transition: "all 0.3s ease",
								},
								"& .MuiOutlinedInput-notchedOutline": {
									borderColor: "rgba(148,163,184,0.4)",
								},
								"&:hover .MuiOutlinedInput-notchedOutline": {
									borderColor: "#3b82f6",
								},
								"& .Mui-focused .MuiOutlinedInput-notchedOutline": {
									borderColor: "#2563eb",
								},
							}}
						/>

						<Button
							fullWidth
							variant="contained"
							type="submit"
							size="large"
							disabled={loading}
							className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-4 rounded-xl normal-case font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 active:scale-[0.98]"
						>
							{loading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								"Sign In"
							)}
						</Button>
					</form>

					{/* Footer */}
					<Box className="mt-10 pt-6 border-t border-white/40 text-center">
						<Typography variant="caption" className="text-slate-400">
							© 2026 Content Workflow System
						</Typography>
					</Box>
				</Paper>
			</Container>
		</div>
	);
}
