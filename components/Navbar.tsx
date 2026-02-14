"use client";

import {
	AppBar,
	Toolbar,
	Container,
	Box,
	Typography,
	Avatar,
	IconButton,
	Divider,
	Button,
} from "@mui/material";
import { LayoutDashboard, Bell, LogOut } from "lucide-react";

interface NavbarProps {
	email: string;
	role: string;
	onLogout: () => void;
	isLoggingOut: boolean;
}

export default function Navbar({
	email,
	role,
	onLogout,
	isLoggingOut,
}: NavbarProps) {
	return (
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
								{email?.charAt(0).toUpperCase()}
							</Avatar>

							<Box className="hidden sm:block">
								<Typography className="text-sm font-semibold text-slate-800">
									{email}
								</Typography>
								<Typography className="text-xs text-blue-600 font-bold uppercase tracking-tighter">
									{role}
								</Typography>
							</Box>

							<Button
								onClick={onLogout}
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
	);
}
