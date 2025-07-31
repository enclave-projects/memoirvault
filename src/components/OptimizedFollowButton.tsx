"use client";

import { useState, useOptimistic } from 'react';

interface OptimizedFollowButtonProps {
    targetUserId: string;
    targetUserName: string;
    initialIsFollowing: boolean;
    initialFollowersCount: number;
    onCountUpdate?: (newCount: number) => void;
}

export default function OptimizedFollowButton({ 
    targetUserId, 
    targetUserName, 
    initialIsFollowing, 
    initialFollowersCount,
    onCountUpdate 
}: OptimizedFollowButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Optimistic state for immediate UI updates
    const [optimisticState, setOptimisticState] = useOptimistic(
        { isFollowing: initialIsFollowing, followersCount: initialFollowersCount },
        (state, action: { type: 'follow' | 'unfollow' }) => ({
            isFollowing: action.type === 'follow',
            followersCount: action.type === 'follow' 
                ? state.followersCount + 1 
                : Math.max(0, state.followersCount - 1)
        })
    );

    const handleFollowToggle = async () => {
        if (isLoading) return;

        const action = optimisticState.isFollowing ? 'unfollow' : 'follow';
        
        // Optimistic update - immediate UI change
        setOptimisticState({ type: action });
        setIsLoading(true);

        try {
            const response = await fetch('/api/public/follow-optimized', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    targetUserId,
                    action,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                // Update parent component with new count
                if (onCountUpdate && data.optimistic?.targetFollowersCount !== undefined) {
                    onCountUpdate(data.optimistic.targetFollowersCount);
                }
            } else {
                // Revert optimistic update on error
                setOptimisticState({ type: optimisticState.isFollowing ? 'follow' : 'unfollow' });
                const errorData = await response.json();
                alert(errorData.error || 'Failed to update follow status');
            }
        } catch (error) {
            // Revert optimistic update on error
            setOptimisticState({ type: optimisticState.isFollowing ? 'follow' : 'unfollow' });
            console.error('Error toggling follow:', error);
            alert('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleFollowToggle}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                optimisticState.isFollowing
                    ? 'border border-[#EBEDE8] text-[#333F3C] hover:bg-[#EBEDE8] hover:border-red-300 hover:text-red-600'
                    : 'bg-[#004838] text-[#E2FB6C] hover:bg-[#073127] shadow-md hover:shadow-lg'
            } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    {optimisticState.isFollowing ? 'Unfollowing...' : 'Following...'}
                </span>
            ) : (
                optimisticState.isFollowing ? 'Following' : 'Follow'
            )}
        </button>
    );
}