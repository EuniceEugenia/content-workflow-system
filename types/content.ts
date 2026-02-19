export type ContentStatus = "draft" | "review" | "rejected" | "published";

export interface Content {
	id: string;
	title: string;
	body: string;
	status: ContentStatus;
	author_id: string;
	reviewer_id?: string | null; // future assign reviewer
	category_id: number;
	created_at: string;
	file_path: string | null;
}

export interface DashboardStats {
	total: number;
	draft: number;
	review: number;
	published: number;
	rejected: number;
}

export interface ContentListItem {
	id: string;
	title: string;
	status: ContentStatus;
	created_at: string;
}
