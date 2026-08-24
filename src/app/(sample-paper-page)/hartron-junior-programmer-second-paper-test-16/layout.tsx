import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createPageMetadata } from "../../../shared/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Hartron Junior Programmer Paper 16 | Programming Test",
  description:
    "Hartron Junior Programmer Programming Test covering ABC Firm Professional Services, MstProfessionalType, TblDeployment, combo box for professional type selection, automatic calculation of One Time Charges, Tax and Total Charges, and deployment report.",
  path: "/hartron-junior-programmer-second-paper-test-16",
  index: true,
});

export default function HartronJuniorProgrammerTest16Layout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}