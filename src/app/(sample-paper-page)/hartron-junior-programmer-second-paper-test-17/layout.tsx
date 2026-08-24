import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 17 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Credit Card Management System, Credit Master, Customer Master, transaction types (Shopping/Withdrawal), service tax calculation (10.3% for Shopping, 0% for Withdrawal), and transaction reports.",
  path: "/hartron-junior-programmer-second-paper-test-17",
  index: true,
});

export default function HartronJuniorProgrammerTest17Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}