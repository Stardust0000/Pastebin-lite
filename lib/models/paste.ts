// this is what defines what a Paste is

// creating exportable interface -Paste
export interface Paste{
    id: string;
    content: string;
    expires_at: Date | null;
    remaining_views: number | null;
    created_at: Date;
}