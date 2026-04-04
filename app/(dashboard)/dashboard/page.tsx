import { getAllUsers } from "@/lib/actions/users"; // We'll create this next
import UserTableClient from "./user-table-client";
 

export default async function DashboardPage() {
  // Fetch real users from your PostgreSQL DB
  const dbUsers = await getAllUsers();

  return (
    <div className="space-y-10">
      {/* ─── Hero / Stats (Static for now, but can be made dynamic) ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Hunters" value={dbUsers.length.toString()} change="Real-time count" />
        <StatCard label="Active Licenses" value="--" change="Pending Sync" />
        <StatCard label="System Load" value="24%" change="Normal Status" isGreen />
      </section>

      {/* ─── The Dynamic Table Client ─── */}
      <section>
        <UserTableClient initialData={dbUsers} />
      </section>
    </div>
  );
}

// Keep the StatCard here or move to a component file
function StatCard({ label, value, change, isGreen = false }: { label: string, value: string, change: string, isGreen?: boolean }) {
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className={`text-3xl font-bold mb-2 ${isGreen ? 'text-[#22c55e]' : 'text-white'}`}>{value}</h3>
      <p className="text-xs text-gray-400">{change}</p>
    </div>
  );
}