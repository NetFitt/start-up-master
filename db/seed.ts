// src/db/seed.ts
// Run with: npx tsx src/db/seed.ts
import 'dotenv/config'
import { db } from './index'
import { users } from './schema/auth'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('\n🌿 Seeding hunting system database...\n')

  const passwordHash = await bcrypt.hash('Admin@2024!', 12)

  await db
    .insert(users)
    .values({
      name: 'Super Admin',
      email: 'admin@hunting.dz',
      password_hash: passwordHash,
      role: 'super_admin',
      is_active: true,
    })
    .onConflictDoNothing()

  console.log('✅ Super admin created')
  console.log('   ─────────────────────────────')
  console.log('   Email    : admin@hunting.dz')
  console.log('   Password : Admin@2024!')
  console.log('   Role     : super_admin')
  console.log('   ─────────────────────────────')
  console.log('\n⚠️  Change the password after first login!\n')

  process.exit(0)
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e)
  process.exit(1)
})