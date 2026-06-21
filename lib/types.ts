import type { TransactionType } from "./categories";

export interface Transaction {
  id: string;
  user_id: string;
  descricao: string;
  valor: number;
  data: string; // YYYY-MM-DD
  tipo: TransactionType;
  categoria: string;
  created_at: string;
}

export type TransactionInput = Omit<
  Transaction,
  "id" | "user_id" | "created_at"
>;

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: Transaction;
        Insert: Omit<Transaction, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<Transaction, "id" | "user_id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
