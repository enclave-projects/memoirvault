'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ServiceStatus {
  id: string;
  serviceName: string;
  status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage' | 'maintenance';
  description?: string;
  lastChecked: string;
}

const statusColors = {
  operational: 'bg-green-500',
  degraded: 'bg-yellow-500',
  partial_outage: 'bg-orange-500',
  major_outage: 'bg-red-500',
  maintenance: 'bg-blue-500'
};

const statusLabels = {
  operational: 'Operational',
  degraded: 'Degraded Performance',
  partial_outage: 'Partial Outage',
  major_outage: 'Major Outage',
  maintenance: 'Maintenance'
};

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [overallStatus, setOverallStatus] = useState<'operational' | 'issues'>('operational');

  useEffect(() => {
    fetchStatus();
    // Refresh status every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/support/status');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services);
        
        // Determine overall status
        const hasIssues = data.services.some((service: ServiceStatus) => 
          service.status !== 'operational'
        );
        setOverallStatus(hasIssues ? 'issues' : 'operational');
      }
    } catch (error) {
      console.error('Error fetching status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-[#EBEDE8]">
      {/* Header */}
      <header className="bg-[#004838] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">📖</span>
              <span className="text-xl font-bold">MemoirVault</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/features" className="hover:text-[#E2FB6C] transition-colors">Features</Link>
              <Link href="/security" className="hover:text-[#E2FB6C] transition-colors">Security</Link>
              <Link href="/pricing" className="hover:text-[#E2FB6C] transition-colors">Pricing</Link>
              <Link href="/dashboard" className="bg-[#E2FB6C] text-[#004838] px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex space-x-2 text-sm">
            <Link href="/" className="text-[#333F3C] hover:text-[#004838]">Home</Link>
            <span className="text-[#333F3C]">/</span>
            <Link href="/support" className="text-[#333F3C] hover:text-[#004838]">Support</Link>
            <span className="text-[#333F3C]">/</span>
            <span className="text-[#004838] font-medium">Status</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className={`py-16 ${overallStatus === 'operational' ? 'bg-gradient-to-br from-green-600 to-green-700' : 'bg-gradient-to-br from-orange-600 to-red-600'} text-white`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-4 h-4 rounded-full mr-3 ${overallStatus === 'operational' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {overallStatus === 'operational' ? 'All Systems Operational' : 'Some Systems Experiencing Issues'}
            </h1>
          </div>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            {overallStatus === 'operational' 
              ? 'All MemoirVault services are running smoothly.'
              : 'We are aware of the issues and working to resolve them quickly.'
            }
          </p>
          <div className="mt-6 text-sm text-gray-200">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>
      </section>

      {/* Status Overview */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#004838] mb-8 text-center">Service Status</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004838] mx-auto"></div>
              <p className="mt-4 text-[#333F3C]">Loading service status...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${statusColors[service.status]}`}></div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#004838] capitalize">
                          {service.serviceName.replace('_', ' ')}
                        </h3>
                        {service.description && (
                          <p className="text-[#333F3C] mt-1">{service.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        service.status === 'operational' ? 'bg-green-100 text-green-800' :
                        service.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                        service.status === 'partial_outage' ? 'bg-orange-100 text-orange-800' :
                        service.status === 'major_outage' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {statusLabels[service.status]}
                      </div>
                      <p className="text-xs text-[#333F3C] mt-1">
                        Last checked: {formatDate(service.lastChecked)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Status History */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#004838] mb-8 text-center">Recent Status History</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#004838]">All Systems Operational</h3>
                <span className="text-sm text-[#333F3C]">Today, 12:00 PM</span>
              </div>
              <p className="text-[#333F3C]">All services are running normally with no reported issues.</p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#004838]">Scheduled Maintenance Completed</h3>
                <span className="text-sm text-[#333F3C]">Yesterday, 2:00 AM - 3:00 AM</span>
              </div>
              <p className="text-[#333F3C]">
                Completed scheduled database maintenance to improve performance. All services are now fully operational.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#004838]">Performance Improvements Deployed</h3>
                <span className="text-sm text-[#333F3C]">3 days ago, 10:00 AM</span>
              </div>
              <p className="text-[#333F3C]">
                Deployed optimizations that reduced average response times by 40%. All systems performing excellently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="bg-[#004838] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-gray-300 mb-8">
            Get notified about service updates and maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-[#333F3C] border-0 focus:ring-2 focus:ring-[#E2FB6C]"
            />
            <button className="bg-[#E2FB6C] text-[#004838] px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            You can also follow us on social media or check this page for real-time updates.
          </p>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-[#004838] mb-4">Need Help?</h2>
          <p className="text-xl text-[#333F3C] mb-8">
            If you're experiencing issues not reflected on this page, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/support/contact" 
              className="bg-[#004838] text-white px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Contact Support
            </Link>
            <Link 
              href="/support/help-center" 
              className="border-2 border-[#004838] text-[#004838] px-8 py-4 rounded-lg font-semibold hover:bg-[#004838] hover:text-white transition-colors"
            >
              Help Center
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333F3C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl">📖</span>
                <span className="text-xl font-bold">MemoirVault</span>
              </div>
              <p className="text-gray-300">
                Your life story, completely private. Built with privacy-first principles for the modern digital age.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/features" className="hover:text-white">Features</Link></li>
                <li><Link href="/security" className="hover:text-white">Security</Link></li>
                <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/support/help-center" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/support/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/support/community" className="hover:text-white">Community</Link></li>
                <li><Link href="/support/status" className="hover:text-white">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 MemoirVault. All rights reserved. Built with privacy in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}