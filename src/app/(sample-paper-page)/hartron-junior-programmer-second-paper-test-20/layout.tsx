import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 20 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering License Management System, State_Mst, License_Dtls, interface with dropdowns for State and VehicleType, validations including age eligibility (18 years), license validity (10 years), and license reports.",
  path: "/hartron-junior-programmer-second-paper-test-20",
  index: true,
});

export default function HartronJuniorProgrammerTest20Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}