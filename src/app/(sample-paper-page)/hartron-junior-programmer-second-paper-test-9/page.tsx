import Link from "next/link";

const subjectMaster = [
  { field: "Subject_Code", dataType: "Integer", remarks: "Primary Key (AutoNumber)" },
  { field: "Subject_Name", dataType: "Varchar", remarks: "Not Null" },
];

const tblCandidate = [
  { field: "Roll_No", dataType: "Integer", remarks: "Primary Key (AutoNumber)" },
  { field: "Student_Name", dataType: "Varchar", remarks: "" },
  { field: "Subject_Code", dataType: "Integer", remarks: "Foreign Key" },
  { field: "Marks_in_Test1", dataType: "Integer", remarks: "" },
  { field: "Marks_in_Test2", dataType: "Integer", remarks: "" },
  { field: "Result(Pass/Fail)", dataType: "Varchar", remarks: "Automatic" },
];

function DatabaseTable({
  title,
  rows,
}: {
  title: string;
  rows: { field: string; dataType: string; remarks: string }[];
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
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans whitespace-nowrap">
                  Field Name
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans whitespace-nowrap">
                  Data Type
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans whitespace-nowrap">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={row.field} className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 font-medium text-[#1e2a2a] font-serif text-sm">
                    {row.field}
                  </td>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-sans text-sm">
                    {row.dataType}
                  </td>
                  <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-serif text-sm italic">
                    {row.remarks || "—"}
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

function ReportTable1() {
  const columns = ["Roll_No", "Student_Name", "Marks_in_Test1", "Marks_in_Test2", "Result (Pass/Fail)"];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6d0e8] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eeeaf8]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 1 blank row */}
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

function ReportTable2() {
  const columns = ["Subject_Name", "No. of Students"];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6d0e8] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eeeaf8]">
              {columns.map((col) => (
                <th
                  key={col}
                  className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 1 blank row */}
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

export default function HartronJuniorProgrammerPaper9() {
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
                <p className="text-lg font-bold text-white font-serif">9</p>
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
          {/* Database Tables */}
          <section>
            <DatabaseTable title="Table 1 : Subject_Master" rows={subjectMaster} />
            <DatabaseTable title="Table 2 : Tbl_Candidate" rows={tblCandidate} />
          </section>

          {/* Condition 1 */}
          <section className="mt-8">
            <div className="flex gap-2.5 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                1
              </span>
              <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                Create GUI to save data in Tbl_Candidate.
              </h2>
            </div>
          </section>

          {/* Condition 2 */}
          <section className="mt-8">
            <div className="flex gap-2.5 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                2
              </span>
              <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                Make atleast 5 Manual Entries in Subject_Master.
              </h2>
            </div>
          </section>

          {/* Condition 3 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  3
                </span>
                <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                  Max Marks for both Subjects is 50.
                </h2>
              </div>
              <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                <p className="text-xs font-semibold text-[#55458f] font-sans">
                  Maximum marks in Test 1 = 50 and Maximum marks in Test 2 = 50.
                </p>
              </div>
            </div>
          </section>

          {/* Condition 4 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  4
                </span>
                <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                  Passing Marks Min 50% in Individual Test.
                </h2>
              </div>
              <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                <p className="text-xs font-semibold text-[#55458f] font-sans">
                  Minimum passing marks = 25 out of 50 in each individual test.
                </p>
              </div>
            </div>
          </section>

          {/* Condition 5 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  5
                </span>
                <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                  If Student Pass in both Subjects then Student is Pass otherwise Fail.
                </h2>
              </div>
              <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-white p-3 border border-[#d6d0e8]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#98A2B3] font-sans">
                      Pass
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#009b67] font-serif">
                      Both Test 1 and Test 2 ≥ 25
                    </p>
                  </div>
                  <div className="rounded-lg bg-white p-3 border border-[#d6d0e8]">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#98A2B3] font-sans">
                      Fail
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#d04a4a] font-serif">
                      Either Test 1 or Test 2 &lt; 25
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Report 1 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  R1
                </span>
                <div>
                  <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                    Report 1
                  </h2>
                </div>
              </div>
              <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                <p className="text-xs font-semibold text-[#55458f] font-sans">
                  Drop-down: Pass/Fail
                </p>
              </div>
              <ReportTable1 />
            </div>
          </section>

          {/* Report 2 */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  R2
                </span>
                <div>
                  <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                    Report 2
                  </h2>
                  <p className="mt-0.5 text-sm font-medium text-[#667085] font-serif">
                    Subject wise No of Passed Students
                  </p>
                </div>
              </div>
              <ReportTable2 />
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
            href="/hartron-junior-programmer-second-paper-test-8"
            className="rounded-2xl border border-[#d6d0e8] bg-white p-4 transition hover:border-[#55458f] hover:bg-[#f7f3ff]"
          >
            <p className="text-[10px] font-semibold text-[#98A2B3] font-sans">← Previous Paper</p>
            <p className="mt-0.5 text-sm font-bold text-[#55458f] font-serif">Paper 8</p>
          </Link>
          <Link
            href="/hartron-junior-programmer-second-paper-test-10"
            className="rounded-2xl border border-[#d6d0e8] bg-white p-4 text-right transition hover:border-[#55458f] hover:bg-[#f7f3ff]"
          >
            <p className="text-[10px] font-semibold text-[#98A2B3] font-sans">Next Paper →</p>
            <p className="mt-0.5 text-sm font-bold text-[#55458f] font-serif">Paper 10</p>
          </Link>
        </div>
      </div>
    </main>
  );
}