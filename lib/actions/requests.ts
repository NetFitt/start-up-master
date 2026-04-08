// src/lib/actions/requests.ts
'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { requests } from "@/db/schema/requests"

export async function submitAssociationRequest(formData: any) {
    try {
      const session = await auth()
      const userId = session?.user?.id ?? null
  
      await db.insert(requests).values({
        userId: userId,
        targetDistrictId: formData.districtId,
        type: "ASSOCIATION_CREATION",
        status: "PENDING",
        data: {
          name: formData.associationName,
          description: formData.description,
          address: formData.address,
          presidentName: formData.presidentName,
          presidentEmail: formData.presidentEmail,
          presidentPhone: formData.presidentPhone,
          presidentNIN: formData.presidentNIN,
        }
      })
  
      // 🚀 CRITICAL: You must return this so the frontend sees 'res.success'
      return { success: true } 
  
    } catch (error: any) {
      console.error("SUBMISSION_ERROR:", error)
      
      // 🚀 CRITICAL: You must return this so the frontend sees 'res.error'
      return { 
        error: error.message || "Failed to submit request. Please try again." 
      }
    }
  }