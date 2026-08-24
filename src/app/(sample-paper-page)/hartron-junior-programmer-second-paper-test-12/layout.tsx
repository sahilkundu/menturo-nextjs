import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 12 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Order Management System, Item Master, Order Details, form design with calendar and validations, discount calculation (10%), and two reports - Order Date wise and Monthly Item Sales report.",
  path: "/hartron-junior-programmer-second-paper-test-12",
  index: true,
});

export default function HartronJuniorProgrammerTest12Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}