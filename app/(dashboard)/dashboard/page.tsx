import { auth } from "@/auth";
import { getAllUsers } from "@/lib/actions/users"; 
import UserTableClient from "./user-table-client";

export default async function DashboardPage() {
  // 1. Get the current session (The "Who is looking?")
  const session = await auth();
  const currentUser = session?.user;

  // 2. Pass the user context to our fetcher
  // This ensures a Batna admin only gets Batna hunters
  const dbUsers = await getAllUsers(currentUser);

  return (
    <div className="space-y-10">
      {/* <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Members" value={dbUsers.length.toString()} change="In your jurisdiction" />
        <StatCard label="Active Licenses" value="--" change="Pending Sync" />
        <StatCard label="System Load" value="24%" change="Normal Status" isGreen />
      </section> */}

      <section>
        {/* Pass the role to the client so the form knows what options to show */}
        <UserTableClient 
           initialData={dbUsers} 
           currentUserRole={currentUser?.role} 
        />
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