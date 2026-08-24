import Link from "next/link";

const mstProfessionalType = [
  { field: "ProfessionalTypeID", dataType: "Int", remark: "PK" },
  { field: "ProfessionalTypeName", dataType: "Varchar", remark: "NotNull" },
  { field: "OneTimeCharges", dataType: "Decimal", remark: "NotNull" },
];

const tblDeployment = [
  { field: "TransID", dataType: "Int", remark: "PK" },
  { field: "ProfessionalTypeID", dataType: "Int", remark: "NotNull" },
  { field: "DepartmentName", dataType: "Varchar", remark: "NotNull" },
  { field: "No. of Professionals", dataType: "Int", remark: "NotNull" },
  { field: "One Time Charges", dataType: "Decimal", remark: "Autocalculate" },
  { field: "Tax", dataType: "Decimal", remark: "Autocalculate" },
  { field: "Charges", dataType: "Decimal", remark: "Autocalculate" },
];

function DatabaseTable({
  title,
  rows,
}: {
  title: string;
  rows: { field: string; dataType: string; remark: string }[];
}) {
  return (
    <div className="mt-5">
      <h3 className="mb-2 text-base font-semibold text-[#1e2a2a] font-serif tracking-wide">
        {title}
      </h3>
      <div className="overflow-hidden rounded-xl border border-[#d6d0e8] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[320px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#eeeaf8]">
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold text-[#25223d] font-sans whitespace-nowrap">
                  S#
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold text-[#25223d] font-sans whitespace-nowrap">
                  Field Name
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold text-[#25223d] font-sans whitespace-nowrap">
                  Data Type
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold text-[#25223d] font-sans whitespace-nowrap">
                  Remark
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.field} className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 font-medium text-[#1e2a2a] font-serif text-sm">
                    {idx + 1}
                  </td>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 font-medium text-[#1e2a2a] font-serif text-sm">
                    {row.field}
                  </td>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-sans text-sm">
                    {row.dataType}
                  </td>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-serif text-sm italic">
                    {row.remark || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportTable() {
  const columns = ["SrNo", "Professional Type Name", "Total Professionals Deployed", "Total Charges Collected"];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6d0e8] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eeeaf8]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold text-[#25223d] font-sans whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 1 }).map((_, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}>
                {columns.map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#1e2a2a] font-serif text-sm"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HartronJuniorProgrammerPaper16() {
  return (
    <main className="min-h-screen bg-[#f4f7f7] px-3 py-4 sm:px-6 lg:px-8 font-serif">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="overflow-hidden rounded-[20px] bg-white shadow-[0_8px_30px_rgba(40,35,75,0.06)]">
          <div className="bg-gradient-to-r from-[#292e45] via-[#55458f] to-[#884dde] px-4 py-5 sm:px-8 sm:py-7">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white font-sans">
                  Sample Paper
                </span>
                <h1 className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-3xl font-serif">
                  Programming Test
                </h1>
                <p className="mt-0.5 text-sm font-medium text-white/80 font-serif">
                  Hartron
                </p>
              </div>
              <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm text-center sm:text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70 font-sans">
                  Paper
                </p>
                <p className="text-lg font-bold text-white font-serif">16</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2.5 sm:px-8">
            <span className="inline-block rounded-full border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-1 text-[11px] font-bold text-[#55458f] font-sans tracking-wide">
              Category: Junior Programmer
            </span>
          </div>
        </header>

        {/* Paper */}
        <article className="mt-5 rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(40,35,75,0.05)] sm:p-8">
          {/* Introduction */}
          <section>
            <p className="text-base leading-7 text-[#3f4657] font-serif">
              An ABC firm provides three types of computer professions (Programmer, Junior Programmer &amp; DEO) to other State Govt. Depts. and UTs. For providing the services, the firm collects charges including tax. Design an application to save the details pertaining to the same using following database tables.
            </p>
          </section>

          {/* Database Tables */}
          <section>
            <DatabaseTable title="Table 1 - MstProfessionalType" rows={mstProfessionalType} />
            <DatabaseTable title="Table 2 - TblDeployment" rows={tblDeployment} />
          </section>

          {/* Question 2 */}
          <section className="mt-8">
            <div className="flex gap-2.5 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                2
              </span>
              <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                Make at least 3 manual entries in the MstProfessionalType.
              </h2>
            </div>
          </section>

          {/* Question 3 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  3
                </span>
                <div>
                  <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                    Design GUI to save data in table tbldeployment.
                  </h2>
                  <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#55458f] font-sans">
                      Use combo box for selecting ProfessionalTypeName from master table.
                    </p>
                  </div>
                  <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                    <p className="text-xs font-semibold text-[#55458f] font-sans">
                      One Time Charges = OneTimeCharges × No. of Professionals
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#55458f] font-sans">
                      Tax = One Time Charges × Tax%
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[#55458f] font-sans">
                      Charges = One Time Charges + Tax
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Question 4 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  4
                </span>
                <div>
                  <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                    Design the following Report:
                  </h2>
                </div>
              </div>
              <ReportTable />
            </div>
          </section>

          {/* Note */}
          <div className="mt-8 rounded-xl border border-[#f4d99a] bg-[#fff9e9] px-3 py-2.5">
            <p className="text-sm font-semibold text-[#805b00] font-serif">
              Note: Incorporate proper checks and validations.
            </p>
          </div>
        </article>

        {/* Navigation */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href="/hartron-junior-programmer-second-paper-test-15"
            className="rounded-2xl border border-[#d6d0e8] bg-white p-4 transition hover:border-[#55458f] hover:bg-[#f7f3ff]"
          >
            <p className="text-[10px] font-semibold text-[#98A2B3] font-sans">← Previous Paper</p>
            <p className="mt-0.5 text-sm font-bold text-[#55458f] font-serif">Paper 15</p>
          </Link>
          <Link
            href="/hartron-junior-programmer-second-paper-test-17"
            className="rounded-2xl border border-[#d6d0e8] bg-white p-4 text-right transition hover:border-[#55458f] hover:bg-[#f7f3ff]"
          >
            <p className="text-[10px] font-semibold text-[#98A2B3] font-sans">Next Paper →</p>
            <p className="mt-0.5 text-sm font-bold text-[#55458f] font-serif">Paper 17</p>
          </Link>
        </div>
      </div>
    </main>
  );
}