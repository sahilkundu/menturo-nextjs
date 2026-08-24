import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 21 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Stock Management System, StockTable, StateTable, dropdown for ItemName, stock limit validation, bill calculation, and sales report.",
  path: "/hartron-junior-programmer-second-paper-test-21",
  index: true,
});

export default function HartronJuniorProgrammerTest21Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}