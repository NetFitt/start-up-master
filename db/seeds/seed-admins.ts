import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { stateDirectorates } from "../schema/stateDirectorate";
import { users } from "../schema/auth";
import "dotenv/config";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedAdmins() {
  console.log("🔐 Starting Directorate Admin Seeding...");

  // 1. Get all 58 Directorates we created earlier
  const allDirectorates = await db.select().from(stateDirectorates);

  if (allDirectorates.length === 0) {
    console.error("❌ No directorates found. Run the directorate seed first!");
    return;
  }

  // 2. Standard Hashed Password for development (password123)
  // In a real app, use bcrypt.hash('password123', 10)
  const defaultPasswordHash = "$2b$10$EP/k3zN/JbC.uE0A4E.mUe8D0Oq.2vQxTQqhY0G/9hK5pW.48H./G";

  const adminAccounts = allDirectorates.map((dir) => {
    // We create a clean email based on the wilaya code
    // e.g. admin.05@youhunt.dz for Batna
    const code = String(dir.wilaya_code).padStart(2, '0');
    
    return {
      name: `Directeur ${dir.name.replace("Direction de Wilaya - ", "")}`,
      email: `admin.${code}@youhunt.dz`,
      password_hash: defaultPasswordHash,
      role: 'wilaya_admin' as const,
      directorate_id: dir.id, // Linking the UUID
      is_active: true,
    };
  });

  try {
    console.log(`Inserting ${adminAccounts.length} Admin accounts...`);
    
    // Using onConflictDoNothing to avoid errors if you run this twice
    await db.insert(users).values(adminAccounts).onConflictDoNothing();
    
    console.log("✅ All 58 Directorate Admins are now active.");
    console.log("👉 Test Login: admin.05@youhunt.dz / password123");
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
  }
}

seedAdmins();