import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 13 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Library Management System, Author Master, Book Details, royalty calculation (10% for ≤500, 15% for >500), and book report generation.",
  path: "/hartron-junior-programmer-second-paper-test-13",
  index: true,
});

export default function HartronJuniorProgrammerTest13Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}