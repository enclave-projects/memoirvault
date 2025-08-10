'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

interface CommunityPost {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  authorName: string;
  authorEmail?: string;
  isExistingUser: boolean;
  userId?: string;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
}

export default function CommunityPage() {
  const { user } = useUser();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    authorName: user?.fullName || '',
    authorEmail: user?.primaryEmailAddress?.emailAddress || '',
    isExistingUser: !!user
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        authorName: user.fullName || '',
        authorEmail: user.primaryEmailAddress?.emailAddress || '',
        isExistingUser: true
      }));
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/support/community');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching community posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          videoUrl: '',
          authorName: user?.fullName || '',
          authorEmail: user?.primaryEmailAddress?.emailAddress || '',
          isExistingUser: !!user
        });
        setShowNewPostForm(false);
        fetchPosts(); // Refresh posts
      } else {
        alert('Failed to create post. Please try again.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#EBEDE8]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/logo/memoirvault.png"
              alt="MemoirVault Logo"
              className="w-8 h-8"
            />
            <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
          </Link>
          <Link href="/" className="text-[#333F3C] hover:text-[#004838] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-4">Community</h1>
            <p className="text-xl text-[#333F3C] opacity-75 max-w-2xl">
              Share your experiences, ask questions, and connect with other memoir writers. Everyone is welcome!
            </p>
          </div>
          <button
            onClick={() => setShowNewPostForm(true)}
            className="gradient-cta text-[#E2FB6C] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
          >
            📝 Create New Post
          </button>
        </div>

        {/* New Post Form Modal */}
        {showNewPostForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#004838]">Create New Post</h2>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className="text-[#333F3C] hover:text-[#004838] text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-[#333F3C] mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                      placeholder="What's your post about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-[#333F3C] mb-2">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
                      placeholder="Share your thoughts, questions, or experiences..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="imageUrl" className="block text-sm font-medium text-[#333F3C] mb-2">
                        Image URL (Optional)
                      </label>
                      <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label htmlFor="videoUrl" className="block text-sm font-medium text-[#333F3C] mb-2">
                        Video URL (Optional)
                      </label>
                      <input
                        type="url"
                        id="videoUrl"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  {!user && (
                    <div className="bg-[#EBEDE8] rounded-lg p-6">
                      <h3 className="font-semibold text-[#004838] mb-4">Author Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="authorName" className="block text-sm font-medium text-[#333F3C] mb-2">
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="authorName"
                            name="authorName"
                            required
                            value={formData.authorName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div>
                          <label htmlFor="authorEmail" className="block text-sm font-medium text-[#333F3C] mb-2">
                            Email (Optional)
                          </label>
                          <input
                            type="email"
                            id="authorEmail"
                            name="authorEmail"
                            value={formData.authorEmail}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-[#333F3C]">
                      {user ?
                        `Posting as ${user.fullName} (MemoirVault user)` :
                        'Posting as guest user'
                      }
                    </p>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowNewPostForm(false)}
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-[#333F3C] hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#004838] text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Posting...' : 'Create Post'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Community Posts */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">Recent Posts</h2>
            <div className="text-sm text-[#333F3C] opacity-75">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
            <p className="mt-4 text-[#333F3C]">Loading community posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">💬</span>
            <h3 className="font-serif text-2xl font-semibold text-[#004838] mb-4">No posts yet</h3>
            <p className="text-[#333F3C] mb-6">
              Be the first to share your thoughts, questions, or experiences with the community!
            </p>
            <button
              onClick={() => setShowNewPostForm(true)}
              className="gradient-cta text-[#E2FB6C] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.id} className="border-b border-[#EBEDE8] pb-8 last:border-b-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-[#EBEDE8] rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-lg">
                        {post.isExistingUser ? '👤' : '👋'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#004838]">{post.authorName}</h3>
                      <div className="flex items-center space-x-2 text-sm text-[#333F3C] opacity-75">
                        <span>{post.isExistingUser ? 'MemoirVault User' : 'Guest'}</span>
                        <span>•</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="font-serif text-xl font-semibold text-[#004838] mb-4">{post.title}</h2>

                <div className="text-[#333F3C] leading-relaxed mb-6">
                  {post.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>

                {/* Media */}
                {(post.imageUrl || post.videoUrl) && (
                  <div className="mb-6">
                    {post.imageUrl && (
                      <div className="mb-4">
                        <img
                          src={post.imageUrl}
                          alt="Post image"
                          className="max-w-full h-auto rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    {post.videoUrl && (
                      <div className="mb-4">
                        <div className="bg-[#EBEDE8] rounded-lg p-4">
                          <p className="text-sm text-[#333F3C] mb-2">Video Link:</p>
                          <a
                            href={post.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#004838] hover:underline break-all"
                          >
                            {post.videoUrl}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center space-x-6">
                    <span className="flex items-center space-x-2 text-[#333F3C] text-sm">
                      <span>👍</span>
                      <span>{post.likesCount} likes</span>
                    </span>
                    <span className="flex items-center space-x-2 text-[#333F3C] text-sm">
                      <span>💬</span>
                      <span>{post.repliesCount} replies</span>
                    </span>
                  </div>
                  <div className="text-sm text-[#333F3C] opacity-75">
                    #{post.id.slice(0, 8)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Guidelines */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8]">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-8 text-center">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">✅ Do</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• Be respectful and kind to all community members</li>
                <li>• Share your genuine experiences and insights</li>
                <li>• Ask questions and help others when you can</li>
                <li>• Use appropriate language and content</li>
                <li>• Respect privacy and confidentiality</li>
              </ul>
            </div>
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">❌ Don't</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• Post spam, advertisements, or promotional content</li>
                <li>• Share personal information of others</li>
                <li>• Use offensive, discriminatory, or harmful language</li>
                <li>• Post copyrighted content without permission</li>
                <li>• Engage in harassment or bullying</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-[#333F3C]">
              Questions about our guidelines? <Link href="/support/contact" className="text-[#004838] hover:underline">Contact our support team</Link>
            </p>
          </div>
        </div>
      </main>


    </div>
  );
}