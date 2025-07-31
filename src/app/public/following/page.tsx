import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { publicProfiles, userFollows } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';

export default async function FollowingPage() {
    const { userId } = await auth();
    
    if (!userId) {
        redirect('/sign-in');
    }

    // Get users that the current user is following
    const following = await db
        .select({
            profile: publicProfiles,
            followedAt: userFollows.createdAt,
        })
        .from(userFollows)
        .innerJoin(publicProfiles, eq(userFollows.followingUserId, publicProfiles.userId))
        .where(eq(userFollows.followerUserId, userId))
        .orderBy(userFollows.createdAt);

    return (
        <div className="min-h-screen bg-[#FEFEFE]">
            {/* Header */}
            <header className="bg-white border-b border-[#EBEDE8] sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                    <Link href="/public/discover" className="font-serif text-xl font-semibold text-[#333F3C]">
                        MemoirVault Public
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                    >
                        Private Space
                    </Link>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="font-serif text-3xl font-semibold text-[#333F3C] mb-2">
                        Following
                    </h1>
                    <p className="text-[#333F3C] opacity-75">
                        People whose memoir journeys you're following ({following.length})
                    </p>
                </div>

                {following.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#EBEDE8]">
                        <div className="text-6xl mb-4">👥</div>
                        <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                            Not following anyone yet
                        </h3>
                        <p className="text-[#333F3C] opacity-75 mb-6">
                            Discover interesting memoir writers to follow their journeys
                        </p>
                        <Link
                            href="/public/discover"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#004838] text-[#E2FB6C] rounded-lg font-medium hover:bg-[#073127] transition-colors"
                        >
                            <span>🔍</span>
                            Discover People
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {following.map(({ profile, followedAt }) => (
                            <div key={profile.id} className="bg-white rounded-xl border border-[#EBEDE8] p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-[#EBEDE8] flex items-center justify-center overflow-hidden">
                                        {profile.profilePicture ? (
                                            <img
                                                src={profile.profilePicture}
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-xl text-[#333F3C]">👤</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-serif font-semibold text-[#333F3C] truncate">
                                            {profile.fullName}
                                        </h3>
                                        <p className="text-sm text-[#333F3C] opacity-75 truncate">
                                            @{profile.username}
                                        </p>
                                    </div>
                                </div>

                                {profile.bio && (
                                    <p className="text-sm text-[#333F3C] mb-4 line-clamp-3">
                                        {profile.bio}
                                    </p>
                                )}

                                <div className="flex items-center justify-between text-xs text-[#333F3C] opacity-75 mb-4">
                                    <span>{profile.publicEntriesCount} entries</span>
                                    <span>{profile.followersCount} followers</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-[#333F3C] opacity-75">
                                        Following since {new Date(followedAt).toLocaleDateString()}
                                    </span>
                                    <Link
                                        href={`/public/profile/${profile.username}`}
                                        className="px-3 py-1 text-sm bg-[#004838] text-[#E2FB6C] rounded-lg hover:bg-[#073127] transition-colors"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}