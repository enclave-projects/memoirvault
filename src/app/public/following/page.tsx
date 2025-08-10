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
        <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
            {/* Modern Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-sm flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                        </div>
                        <div>
                            <Link href="/public/discover" className="font-serif text-xl font-bold text-[#1A1D29] tracking-tight hover:text-[#004838] transition-colors">
                                MemoirVault Public
                            </Link>
                            <div className="text-xs text-[#6B7280] font-medium">Following Network</div>
                        </div>
                    </div>
                    
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Private Space
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Modern Page Header */}
                <div className="text-center mb-12">
                    <div className="relative inline-block mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{following.length}</span>
                        </div>
                    </div>
                    <h1 className="font-serif text-5xl font-bold text-[#1A1D29] mb-4 tracking-tight">
                        Following
                    </h1>
                    <p className="text-[#6B7280] text-xl max-w-2xl mx-auto leading-relaxed">
                        People whose memoir journeys you're following. Stay connected with their latest stories and updates.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 bg-white/40 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/30">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[#1A1D29] font-bold">{following.length} connections</span>
                    </div>
                </div>

                {following.length === 0 ? (
                    <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-12 text-center overflow-hidden">
                        <div className="absolute inset-0 opacity-5">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 rounded-full -translate-x-16 -translate-y-16"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-pink-500 rounded-full translate-x-12 translate-y-12"></div>
                        </div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <span className="text-4xl">👥</span>
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-[#1A1D29] mb-4">
                                Not following anyone yet
                            </h3>
                            <p className="text-[#6B7280] text-lg max-w-md mx-auto leading-relaxed mb-8">
                                Discover interesting memoir writers to follow their journeys and stay updated with their latest stories.
                            </p>
                            <Link
                                href="/public/discover"
                                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Discover People
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {following.map(({ profile, followedAt }, index) => (
                            <div key={profile.id} className="group relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0' : 'right-0'} w-24 h-24 bg-purple-500 rounded-full ${index % 2 === 0 ? '-translate-x-12' : 'translate-x-12'} -translate-y-12`}></div>
                                    <div className={`absolute bottom-0 ${index % 2 === 0 ? 'right-0' : 'left-0'} w-16 h-16 bg-pink-500 rounded-full ${index % 2 === 0 ? 'translate-x-8' : '-translate-x-8'} translate-y-8`}></div>
                                </div>
                                
                                <div className="relative z-10 p-8">
                                    {/* Profile Header */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EBEDE8] to-[#F8F9FA] flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white group-hover:scale-110 transition-transform duration-300">
                                                {profile.profilePicture ? (
                                                    <img
                                                        src={profile.profilePicture}
                                                        alt={profile.fullName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-2xl text-[#6B7280]">👤</span>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-xl border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif text-xl font-bold text-[#1A1D29] truncate group-hover:text-[#004838] transition-colors">
                                                {profile.fullName}
                                            </h3>
                                            <p className="text-[#6B7280] font-medium truncate">
                                                @{profile.username}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    {profile.bio && (
                                        <div className="mb-6">
                                            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                                                <p className="text-[#1A1D29] text-sm leading-relaxed line-clamp-3">
                                                    {profile.bio}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="flex justify-center gap-6 mb-6">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-[#1A1D29] group-hover:text-[#004838] transition-colors">
                                                {profile.publicEntriesCount}
                                            </div>
                                            <div className="text-xs text-[#6B7280] font-medium">Entries</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-[#1A1D29] group-hover:text-[#004838] transition-colors">
                                                {profile.followersCount}
                                            </div>
                                            <div className="text-xs text-[#6B7280] font-medium">Followers</div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                                        <div className="text-xs text-[#6B7280]">
                                            Following since {new Date(followedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </div>
                                        <Link
                                            href={`/public/profile/${profile.username}`}
                                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-xl font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#004838]/30"
                                        >
                                            View Profile
                                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}