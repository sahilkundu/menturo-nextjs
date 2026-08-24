import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 15 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Account Management System, Mst_Account, Transaction_dtls, dropdown for account selection, account holder report with debit/credit totals, and transaction history report.",
  path: "/hartron-junior-programmer-second-paper-test-15",
  index: true,
});

export default function HartronJuniorProgrammerTest15Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}