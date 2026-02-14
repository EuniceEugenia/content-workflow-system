import { Paper, Box, Typography } from "@mui/material";
import { Plus } from "lucide-react";

interface StatsCardProps {
	label: string;
	count: number;
	color: string;
}

export default function StatsCard({ label, count, color }: StatsCardProps) {
	return (
		<Paper
			elevation={0}
			className="p-5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between"
		>
			<Box>
				<Typography className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
					{label}
				</Typography>
				<Typography variant="h5" className="font-black text-slate-900">
					{count}
				</Typography>
			</Box>

			<Box
				sx={{
					width: 32,
					height: 32,
					borderRadius: "8px",
					backgroundColor: `${color}15`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: color,
				}}
			>
				<Plus size={14} />
			</Box>
		</Paper>
	);
}
