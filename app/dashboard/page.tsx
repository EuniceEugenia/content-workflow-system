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
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import ContentTable from "@/components/ContentTable";

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
	const [contents, setContents] = useState<any[]>([]);
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
				const { data: contentData, error: contentError } = await supabase
					.from("contents")
					.select("id, title, status, created_at")
					.order("created_at", { ascending: false });

				if (contentError) {
					console.error("Gagal fetch contents:", contentError);
				} else {
					console.log("CONTENT FROM DB:", contentData);
					setContents(contentData || []);
				}

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
			<Navbar
				email={user?.email || ""}
				role={role || ""}
				onLogout={handleLogout}
				isLoggingOut={isLoggingOut}
			/>
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

					<Box className="mt-12">
						<ContentTable data={contents} />
					</Box>
				</Paper>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
					<StatsCard label="Draft" count={0} color="#64748b" />
					<StatsCard label="Review" count={0} color="#f59e0b" />
					<StatsCard label="Published" count={0} color="#2563eb" />
					<StatsCard label="Rejected" count={0} color="#e11d48" />
				</div>
			</Container>
		</div>
	);
}
