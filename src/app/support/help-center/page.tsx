'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HelpArticle {
  id: string;
  title: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  viewCount: number;
  helpfulCount: number;
}

export default function HelpCenterPage() {
  const [articles, setArticles] = useState<HelpArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<HelpArticle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'general', name: 'General' },
    { id: 'account', name: 'Account' },
    { id: 'privacy', name: 'Privacy' },
    { id: 'technical', name: 'Technical' },
    { id: 'billing', name: 'Billing' },
    { id: 'features', name: 'Features' }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchQuery, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/support/help-articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error fetching help articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.question.toLowerCase().includes(query) ||
        article.answer.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  };

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse('');

    try {
      const response = await fetch('/api/support/ai-help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          context: articles
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiResponse(data.response);
      } else {
        setAiResponse('Sorry, I couldn\'t find an answer to your question. Please try rephrasing or contact our support team.');
      }
    } catch (error) {
      console.error('Error getting AI help:', error);
      setAiResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const markHelpful = async (articleId: string) => {
    try {
      await fetch(`/api/support/help-articles/${articleId}/helpful`, {
        method: 'POST',
      });
      // Refresh articles to show updated count
      fetchArticles();
    } catch (error) {
      console.error('Error marking article as helpful:', error);
    }
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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Help Center</h1>
        <p className="text-xl text-[#333F3C] opacity-75 mb-12 max-w-2xl">
          Find answers to common questions or get AI-powered assistance
        </p>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for help articles or ask a question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              />
            </div>
            <button
              onClick={handleAiSearch}
              disabled={isAiLoading || !searchQuery.trim()}
              className="gradient-cta text-[#E2FB6C] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAiLoading ? '🤖 Thinking...' : '🤖 Ask AI'}
            </button>
          </div>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#004838] mb-4">AI Assistant Response</h3>
                <div className="text-[#333F3C] leading-relaxed">
                  {aiResponse.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-[#333F3C]">
                    Was this helpful? If you need more assistance, please{' '}
                    <Link href="/support/contact" className="text-[#004838] hover:underline">
                      contact our support team
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#004838] text-white'
                    : 'bg-[#EBEDE8] text-[#333F3C] hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
              <p className="mt-4 text-[#333F3C]">Loading help articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="font-serif text-2xl font-semibold text-[#004838] mb-4">No articles found</h3>
              <p className="text-[#333F3C] mb-6">
                {searchQuery ? 
                  `No articles match "${searchQuery}". Try different keywords or browse categories.` :
                  'No articles available in this category.'
                }
              </p>
              <Link 
                href="/support/contact" 
                className="gradient-cta text-[#E2FB6C] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Contact Support
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
                  {searchQuery ? `Search Results (${filteredArticles.length})` : 
                   selectedCategory === 'all' ? 'All Articles' : 
                   categories.find(c => c.id === selectedCategory)?.name}
                </h2>
              </div>

              {filteredArticles.map((article) => (
                <div key={article.id} className="border-b border-[#EBEDE8] pb-8 last:border-b-0">
                  <div className="mb-4">
                    <h3 className="font-serif text-xl font-semibold text-[#004838] mb-2">{article.question}</h3>
                    <div className="flex items-center space-x-4 text-sm text-[#333F3C] opacity-75">
                      <span className="capitalize">{article.category}</span>
                      <span>•</span>
                      <span>{article.viewCount} views</span>
                      <span>•</span>
                      <span>{article.helpfulCount} found helpful</span>
                    </div>
                  </div>

                  <div className="text-[#333F3C] leading-relaxed mb-6">
                    {article.answer.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">{paragraph}</p>
                    ))}
                  </div>

                  {article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, index) => (
                        <span key={index} className="bg-[#EBEDE8] text-[#333F3C] px-3 py-1 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-[#333F3C]">Was this article helpful?</p>
                    <button
                      onClick={() => markHelpful(article.id)}
                      className="border-2 border-[#E2FB6C] text-[#004838] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#E2FB6C] transition-all duration-200"
                    >
                      👍 Yes, this helped
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8] text-center">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-6">
            Still Need Help?
          </h2>
          <p className="text-[#333F3C] mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/support/contact" 
              className="gradient-cta text-[#E2FB6C] px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Contact Support
            </Link>
            <Link 
              href="/support/community" 
              className="border-2 border-[#E2FB6C] text-[#004838] px-8 py-3 rounded-xl font-semibold hover:bg-[#E2FB6C] transition-all duration-200"
            >
              Community Forum
            </Link>
          </div>
        </div>
      </main>


    </div>
  );
}