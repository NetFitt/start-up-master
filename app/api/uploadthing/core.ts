import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";
import { db } from "@/db";
import { uploads } from "@/db/schema/uploads";

const f = createUploadthing();
export type OurFileRouter = typeof ourFileRouter;
export const ourFileRouter = {
  offerMedia: f({ image: { maxFileSize: "4MB", maxFileCount: 8 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }: { 
        metadata: { userId: string }, 
        file: { 
          url: string; 
          key: string; 
          name: string; 
          size: number; 
          type: string;
          customId: string | null;
        } 
      }) => {
        // 🚀 Now 'file.url' and 'file.key' will have perfect autocomplete
        const [record] = await db.insert(uploads).values({
          userId: metadata.userId,
          url: file.url,
          key: file.key,
          name: file.name,
          type: file.type,
          size: file.size,
          purpose: 'offer_image'
        }).returning();
        
        return { uploadId: record.id };
      })
} satisfies FileRouter;