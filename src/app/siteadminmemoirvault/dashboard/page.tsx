'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ServiceStatus {
  id: string;
  serviceName: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  description?: string;
  lastChecked: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

const statusOptions = [
  { value: 'operational', label: 'Operational', color: 'bg-green-500' },
  { value: 'degraded', label: 'Degraded Performance', color: 'bg-yellow-500' },
  { value: 'partial_outage', label: 'Partial Outage', color: 'bg-orange-500' },
  { value: 'major_outage', label: 'Major Outage', color: 'bg-red-500' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-blue-500' }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'status' | 'messages'>('status');

  useEffect(() => {
    // Check authentication and IP restrictions
    checkAuthAndIP();
  }, [router]);

  const checkAuthAndIP = async () => {
    // Check basic authentication
    const isAuthenticated = sessionStorage.getItem('admin_authenticated');
    const loginTime = sessionStorage.getItem('admin_login_time');
    
    if (!isAuthenticated || !loginTime) {
      router.push('/siteadminmemoirvault');
      return;
    }

    // Check if session expired (2 hours)
    const now = Date.now();
    const loginTimestamp = parseInt(loginTime);
    const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    if (now - loginTimestamp > twoHours) {
      sessionStorage.removeItem('admin_authenticated');
      sessionStorage.removeItem('admin_login_time');
      sessionStorage.removeItem('admin_ip');
      router.push('/siteadminmemoirvault');
      return;
    }

    // Check IP restrictions
    try {
      const response = await fetch('/api/admin/ip-check');
      if (!response.ok) {
        console.error('IP check failed, redirecting to login');
        sessionStorage.removeItem('admin_authenticated');
        sessionStorage.removeItem('admin_login_time');
        sessionStorage.removeItem('admin_ip');
        router.push('/siteadminmemoirvault');
        return;
      }
    } catch (error) {
      console.error('IP check error:', error);
      router.push('/siteadminmemoirvault');
      return;
    }

    fetchData();
  };

  const fetchData = async () => {
    try {
      // Fetch service status
      const statusResponse = await fetch('/api/support/status');
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        setServices(statusData.services);
      }

      // Fetch contact messages
      const messagesResponse = await fetch('/api/admin/contact-messages');
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateServiceStatus = async (serviceName: string, status: string, description: string) => {
    try {
      const response = await fetch('/api/support/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceName,
          status,
          description
        }),
      });

      if (response.ok) {
        fetchData(); // Refresh data
      } else {
        alert('Failed to update service status');
      }
    } catch (error) {
      console.error('Error updating service status:', error);
      alert('Failed to update service status');
    }
  };

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_login_time');
    sessionStorage.removeItem('admin_ip');
    router.push('/siteadminmemoirvault');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBEDE8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
          <p className="mt-4 text-[#333F3C]">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBEDE8]">
      {/* Header */}
      <header className="bg-[#004838] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📖</span>
              <span className="text-xl font-bold">MemoirVault Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/support/status" 
                target="_blank"
                className="text-[#E2FB6C] hover:underline"
              >
                View Public Status Page
              </Link>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('status')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'status'
                  ? 'border-[#004838] text-[#004838]'
                  : 'border-transparent text-[#333F3C] hover:text-[#004838] hover:border-gray-300'
              }`}
            >
              Service Status Management
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'messages'
                  ? 'border-[#004838] text-[#004838]'
                  : 'border-transparent text-[#333F3C] hover:text-[#004838] hover:border-gray-300'
              }`}
            >
              Contact Messages ({messages.filter(m => m.status === 'new').length} new)
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'status' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#004838] mb-2">Service Status Management</h1>
              <p className="text-[#333F3C]">
                Update the status of MemoirVault services. Changes will be reflected immediately on the public status page.
              </p>
            </div>

            <div className="space-y-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${
                        statusOptions.find(opt => opt.value === service.status)?.color || 'bg-gray-500'
                      }`}></div>
                      <h3 className="text-xl font-semibold text-[#004838] capitalize">
                        {service.serviceName.replace('_', ' ')}
                      </h3>
                    </div>
                    <div className="text-sm text-[#333F3C]">
                      Last updated: {formatDate(service.lastChecked)}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#333F3C] mb-2">
                        Status
                      </label>
                      <select
                        value={service.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const description = service.description || '';
                          updateServiceStatus(service.serviceName, newStatus, description);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#333F3C] mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={service.description || ''}
                        onChange={(e) => {
                          const newDescription = e.target.value;
                          updateServiceStatus(service.serviceName, service.status, newDescription);
                        }}
                        onBlur={(e) => {
                          const newDescription = e.target.value;
                          updateServiceStatus(service.serviceName, service.status, newDescription);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                        placeholder="Optional status description"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-[#004838] mb-2">Contact Messages</h1>
              <p className="text-[#333F3C]">
                Review and manage contact form submissions from users.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📧</span>
                <h3 className="text-2xl font-bold text-[#004838] mb-4">No messages yet</h3>
                <p className="text-[#333F3C]">Contact form submissions will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#004838] mb-1">
                          {message.subject}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-[#333F3C]">
                          <span><strong>From:</strong> {message.name}</span>
                          <span><strong>Email:</strong> {message.email}</span>
                          <span><strong>Date:</strong> {formatDate(message.createdAt)}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        message.status === 'read' ? 'bg-yellow-100 text-yellow-800' :
                        message.status === 'replied' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                      </div>
                    </div>

                    <div className="bg-[#EBEDE8] rounded-lg p-4 mb-4">
                      <p className="text-[#333F3C] whitespace-pre-wrap">{message.message}</p>
                    </div>

                    <div className="flex items-center space-x-4">
                      <a
                        href={`mailto:${message.email}?subject=Re: ${message.subject}`}
                        className="bg-[#004838] text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => {
                          // In a real app, you'd update the message status
                          console.log('Mark as read:', message.id);
                        }}
                        className="border border-[#004838] text-[#004838] px-4 py-2 rounded-lg font-medium hover:bg-[#004838] hover:text-white transition-colors"
                      >
                        Mark as Read
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}