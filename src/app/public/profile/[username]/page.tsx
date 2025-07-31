import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { publicProfiles, entries, media, publicEntryVisibility } from '@/lib/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import PublicProfileClient from './PublicProfileClient';

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { username } = await params;

  // Fetch public profile
  const profile = await db
    .select()
    .from(publicProfiles)
    .where(eq(publicProfiles.username, username))
    .limit(1);

  if (profile.length === 0) {
    notFound();
  }

  const publicProfile = profile[0];

  // Fetch public entries
  let publicEntries = [];
  
  if (publicProfile.allowSpecificEntries) {
    // If specific entry control is enabled, show only specifically marked public entries
    const specificPublicEntries = await db
      .select({
        id: entries.id,
        title: entries.title,
        description: entries.description,
        createdAt: entries.createdAt,
        updatedAt: entries.updatedAt,
      })
      .from(entries)
      .innerJoin(publicEntryVisibility, eq(entries.id, publicEntryVisibility.entryId))
      .where(
        and(
          eq(entries.userId, publicProfile.userId),
          eq(publicEntryVisibility.isPublic, true)
        )
      )
      .orderBy(desc(entries.createdAt));

    // Get media for each entry
    for (const entry of specificPublicEntries) {
      const entryMedia = await db
        .select()
        .from(media)
        .where(eq(media.entryId, entry.id));
      
      publicEntries.push({
        ...entry,
        media: entryMedia,
      });
    }
  } else if (publicProfile.isJourneyPublic) {
    // If all entries are public (and specific control is disabled), fetch all entries for this user
    const allEntries = await db
      .select({
        id: entries.id,
        title: entries.title,
        description: entries.description,
        createdAt: entries.createdAt,
        updatedAt: entries.updatedAt,
      })
      .from(entries)
      .where(eq(entries.userId, publicProfile.userId))
      .orderBy(desc(entries.createdAt));

    // Get media for each entry
    for (const entry of allEntries) {
      const entryMedia = await db
        .select()
        .from(media)
        .where(eq(media.entryId, entry.id));
      
      publicEntries.push({
        ...entry,
        media: entryMedia,
      });
    }
  }

  return (
    <PublicProfileClient 
      profile={publicProfile} 
      entries={publicEntries}
    />
  );
}