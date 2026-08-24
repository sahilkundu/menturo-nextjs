import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 14 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Library Management System, Book Master, Sales table, dropdown for BookType, max 10 books per person, discount rules (20% on conditions), and sales report generation.",
  path: "/hartron-junior-programmer-second-paper-test-14",
  index: true,
});

export default function HartronJuniorProgrammerTest14Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}