"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
	Container,
	Box,
	Typography,
	Button,
	Paper,
	CircularProgress,
	AppBar,
	Toolbar,
	Avatar,
	IconButton,
	Divider,
} from "@mui/material";
import { LogOut, LayoutDashboard, Bell, Plus } from "lucide-react";

/**
 * Komponen Dashboard Utama (Versi Real RBAC)
 * Mengimplementasikan pengambilan data peran (role) langsung dari database
 * untuk menentukan hak akses pengguna pada antarmuka.
 */

const INFO_CARDS = [
	{ label: "Draft", count: 0, color: "#64748b" },
	{ label: "Review", count: 0, color: "#f59e0b" },
	{ label: "Published", count: 0, color: "#2563eb" },
	{ label: "Rejected", count: 0, color: "#e11d48" },
];

export default function DashboardPage() {
	const router = useRouter();

	// State Management
	const [user, setUser] = useState<{ email: string; id: string } | null>(null);
	const [role, setRole] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	/**
	 * Efek samping untuk validasi sesi dan inisialisasi profil pengguna
	 */
	useEffect(() => {
		const initializeDashboard = async () => {
			try {
				// 1. Validasi Sesi Autentikasi
				const {
					data: { session },
					error: sessionError,
				} = await supabase.auth.getSession();

				if (sessionError || !session) {
					console.warn("Sesi tidak ditemukan, mengalihkan ke halaman login.");
					router.push("/");
					return;
				}

				setUser({
					id: session.user.id,
					email: session.user.email || "",
				});

				// 2. Pengambilan Data Profil dan Relasi Role (RBAC)
				// Mengambil nama role melalui relasi tabel profiles ke roles
				const { data: profile, error: profileError } = await supabase
					.from("profiles")
					.select("role_id, roles(name)")
					.eq("id", session.user.id)
					.single();

				// Keamanan: Jika profil atau role tidak ditemukan, akses ditolak
				if (profileError || !profile || !profile.roles) {
					console.error(
						"Gagal mendapatkan profil pengguna atau peran tidak valid.",
					);
					router.push("/");
					return;
				}

				// Menetapkan nama peran dari hasil join query
				const roleName = (profile.roles as any)?.name;
				setRole(roleName);
				setLoading(false);
			} catch (err) {
				console.error("Kesalahan sistem saat inisialisasi dashboard:", err);
				router.push("/");
			}
		};

		initializeDashboard();
	}, [router]);

	/**
	 * Fungsi untuk menangani pemutusan sesi (Logout)
	 */
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;

			setUser(null);
			router.push("/");
			router.refresh(); // Memastikan state aplikasi di-reset secara menyeluruh
		} catch (err) {
			console.error("Kesalahan saat proses keluar:", err);
			setIsLoggingOut(false);
		}
	};

	// Logika Akses Dinamis: Membatasi fitur berdasarkan peran
	const canCreateContent = role === "Admin" || role === "Creator";

	if (loading || isLoggingOut) {
		return (
			<Box className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 gap-4">
				<CircularProgress size={40} thickness={4} sx={{ color: "#2563eb" }} />
				<Typography className="text-slate-500 font-medium">
					{isLoggingOut ? "Sedang keluar..." : "Memverifikasi identitas..."}
				</Typography>
			</Box>
		);
	}

	return (
		<div className="min-h-screen bg-[#fcfcfd]">
			{/* ===== NAVBAR ===== */}
			<AppBar
				position="sticky"
				elevation={0}
				sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0" }}
			>
				<Container maxWidth="lg">
					<Toolbar className="px-0 py-3 flex justify-between items-center">
						<Box className="flex items-center gap-4">
							<Box className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md">
								<LayoutDashboard size={22} />
							</Box>
							<Box>
								<Typography className="font-extrabold text-slate-900 leading-tight">
									Content Workflow System
								</Typography>
								<Typography className="text-slate-400 text-xs uppercase tracking-widest font-semibold">
									Portal Internal
								</Typography>
							</Box>
						</Box>

						<Box className="flex items-center gap-4">
							<IconButton
								size="small"
								sx={{
									backgroundColor: "#f1f5f9",
									"&:hover": { backgroundColor: "#e2e8f0" },
								}}
							>
								<Bell size={18} />
							</IconButton>
							<Divider
								orientation="vertical"
								flexItem
								sx={{ height: 24, alignSelf: "center" }}
							/>
							<Box className="flex items-center gap-3">
								<Avatar
									sx={{
										width: 36,
										height: 36,
										bgcolor: "#2563eb",
										fontWeight: "bold",
									}}
								>
									{user?.email?.charAt(0).toUpperCase()}
								</Avatar>
								<Box className="hidden sm:block">
									<Typography className="text-sm font-semibold text-slate-800">
										{user?.email}
									</Typography>
									<Typography className="text-xs text-blue-600 font-bold uppercase tracking-tighter">
										{role}
									</Typography>
								</Box>
								<Button
									onClick={handleLogout}
									variant="outlined"
									size="small"
									disabled={isLoggingOut}
									startIcon={<LogOut size={16} />}
									sx={{
										borderColor: "#fecaca",
										color: "#dc2626",
										textTransform: "none",
										fontWeight: "bold",
										borderRadius: "8px",
										"&:hover": {
											borderColor: "#fca5a5",
											backgroundColor: "#fef2f2",
										},
									}}
								>
									Logout
								</Button>
							</Box>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>

			{/* ===== MAIN CONTENT ===== */}
			<Container maxWidth="lg" className="py-10">
				<Paper
					elevation={0}
					className="p-8 md:p-12 rounded-[24px] border border-slate-200 bg-white relative overflow-hidden"
				>
					<div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-60" />
					<Box className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<Box>
							<Typography className="font-black text-slate-900 mb-2 tracking-tight text-4xl">
								Dashboard
							</Typography>
							<Typography className="text-slate-500 font-medium text-lg">
								Selamat datang kembali,{" "}
								<span className="text-blue-600 font-bold">{user?.email}</span>
							</Typography>
						</Box>

						{/* Menampilkan tombol aksi berdasarkan peran pengguna */}
						{canCreateContent && (
							<Button
								variant="contained"
								startIcon={<Plus size={18} />}
								sx={{
									backgroundColor: "#0f172a",
									borderRadius: "12px",
									padding: "10px 24px",
									textTransform: "none",
									fontWeight: "bold",
									"&:hover": { backgroundColor: "#1e293b" },
								}}
							>
								Buat Konten Baru
							</Button>
						)}
					</Box>

					<Box className="mt-12 p-16 border-2 border-dashed border-slate-100 rounded-[20px] bg-slate-50/50 flex flex-col items-center justify-center text-center">
						<Box className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300 mb-4">
							<LayoutDashboard size={32} />
						</Box>
						<Typography variant="h6" className="text-slate-800 font-bold mb-1">
							Integrasi Database Berhasil
						</Typography>
						<Typography variant="body2" className="text-slate-400 max-w-xs">
							Identitas Anda terverifikasi sebagai{" "}
							<span className="font-bold text-blue-600">{role}</span>. Anda
							sekarang dapat melanjutkan ke tahap implementasi TanStack Table.
						</Typography>
					</Box>
				</Paper>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
					{INFO_CARDS.map((item, idx) => (
						<Paper
							key={idx}
							elevation={0}
							className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
						>
							<Box>
								<Typography className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
									{item.label}
								</Typography>
								<Typography variant="h5" className="font-black text-slate-900">
									{item.count}
								</Typography>
							</Box>
							<Box
								sx={{
									width: 32,
									height: 32,
									borderRadius: "8px",
									backgroundColor: `${item.color}15`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: item.color,
								}}
							>
								<Plus size={14} />
							</Box>
						</Paper>
					))}
				</div>
			</Container>
		</div>
	);
}
