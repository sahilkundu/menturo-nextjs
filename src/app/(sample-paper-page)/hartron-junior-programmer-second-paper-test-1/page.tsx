import Link from "next/link";

const agentMaster = [
  { field: "Agent_No", dataType: "Integer", remarks: "Primary Key (AutoNumber)" },
  { field: "Agent_Name", dataType: "Varchar", remarks: "" },
];

const policyDetails = [
  { field: "Policy_No", dataType: "Integer", remarks: "Primary Key (AutoNumber)" },
  { field: "Agent_No", dataType: "Integer", remarks: "Foreign Key" },
  { field: "PolicyDate", dataType: "Date", remarks: "" },
  { field: "CustomerName", dataType: "Varchar", remarks: "" },
  { field: "PolicyAmount", dataType: "Integer", remarks: "" },
  { field: "Commission", dataType: "Decimal", remarks: "To be calculated automatically" },
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
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans">
                  Field Name
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans">
                  DataType
                </th>
                <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.field}
                  className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}
                >
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

function CommissionTable() {
  const commissionData = [
    { amount: "< 10000", commission: "2%" },
    { amount: "> 10000", commission: "2.5%" },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#d6d0e8] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <thead>
            <tr className="bg-[#eeeaf8]">
              <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans">
                Policy Amount
              </th>
              <th className="border-b border-[#d6d0e8] px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[#25223d] font-sans">
                Commission to Agent
              </th>
            </tr>
          </thead>
          <tbody>
            {commissionData.map((row, idx) => (
              <tr
                key={row.amount}
                className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}
              >
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 font-medium text-[#1e2a2a] font-serif text-sm">
                  {row.amount}
                </td>
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 font-bold text-[#009b67] font-sans text-sm">
                  {row.commission}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportTable() {
  const columns = ["Agent", "Policy Date", "Policy Amount", "Commission"];
  
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
            {/* 5 blank rows - exactly like original */}
            {Array.from({ length: 1 }).map((_, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#faf9fd]"}>
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#1e2a2a] font-serif text-sm">
                  &nbsp;
                </td>
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-serif text-sm">
                  &nbsp;
                </td>
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-serif text-sm">
                  &nbsp;
                </td>
                <td className="border-b border-[#eeeaf5] px-3 py-2.5 text-[#4a4a5a] font-serif text-sm">
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function HartronJuniorProgrammerPaper1() {
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
                  Time
                </p>
                <p className="text-lg font-bold text-white font-serif">90 Min.</p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2.5 sm:px-8">
            <span className="inline-block rounded-full border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-1 text-[11px] font-bold text-[#55458f] font-sans tracking-wide">
              Category: Junior Programmer
            </span>
          </div>
        </header>

        {/* Question Paper */}
        <article className="mt-5 rounded-[20px] bg-white p-4 shadow-[0_8px_30px_rgba(40,35,75,0.05)] sm:p-8">
          {/* Question 1 */}
          <section>
            <div className="flex gap-2.5 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                1
              </span>
              <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                Create an application to save data of the insurance agents and customers of ABC Company using the following database tables.
              </h2>
            </div>
            <DatabaseTable title="a. Agent_Master" rows={agentMaster} />
            <DatabaseTable title="b. Policy_Details" rows={policyDetails} />
          </section>

          {/* Question 2 */}
          <section className="mt-8">
            <div className="flex gap-2.5 items-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                2
              </span>
              <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                Make at least 5 manual entries in master table Agent_Master.
              </h2>
            </div>
          </section>

          {/* Question 3 - Fixed alignment */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  3
                </span>
                <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                  Create a GUI to save data in Policy_Details table as per the conditions mentioned below.
                </h2>
              </div>
              <CommissionTable />
              <div className="mt-3 rounded-xl border border-[#d6d0e8] bg-[#f7f3ff] px-3 py-2.5">
                <p className="text-xs font-semibold text-[#55458f] font-sans">
                  Use dropdown list to display Agents.
                </p>
              </div>
            </div>
          </section>

          {/* Question 4 - Fixed alignment */}
          <section className="mt-8">
            <div>
              <div className="flex gap-2.5 items-start">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#55458f] text-xs font-bold text-white font-sans">
                  4
                </span>
                <h2 className="text-base font-bold leading-7 text-[#182A2A] font-serif">
                  Display Report as below:
                </h2>
              </div>
              <ReportTable />
            </div>
          </section>
        </article>

        {/* Next Button */}
        <div className="mt-5 flex justify-end">
          <Link
            href="/hartron-junior-programmer-second-paper-test-2"
            className="inline-block rounded-2xl border border-[#d6d0e8] bg-white px-4 py-3 text-right transition hover:border-[#55458f] hover:bg-[#f7f3ff] w-full sm:w-auto"
          >
            <p className="text-[10px] font-semibold text-[#98A2B3] font-sans">Next Paper →</p>
            <p className="mt-0.5 text-sm font-bold text-[#55458f] font-serif">Paper 2</p>
          </Link>
        </div>
      </div>
    </main>
  );
}