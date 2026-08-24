import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 19 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering Ticket Management System, MstTicketRate, TblTransDetail, dropdown for Ticket Type, discount rule (10% if >5 tickets), and ticket sales report.",
  path: "/hartron-junior-programmer-second-paper-test-19",
  index: true,
});

export default function HartronJuniorProgrammerTest19Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}