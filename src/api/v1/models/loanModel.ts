export interface Loan {
  id: string;
  applicant: string;
  amount: number;
  status: "pending" | "under_review" | "flagged" | "approved";
  createdAt: string;
}