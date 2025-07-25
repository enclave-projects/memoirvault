"use client";

import { useState } from 'react';

export default function DebugPage() {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const runR2Test = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug/r2-test');
      const data = await response.json();
      setTestResults(data);
    } catch (error) {
      console.error('Error running R2 test:', error);
      setTestResults({ error: 'Failed to run test' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#333F3C] mb-8">R2 Storage Debug</h1>
        
        <button
          onClick={runR2Test}
          disabled={loading}
          className="bg-[#004838] text-white px-6 py-3 rounded-lg hover:bg-[#003328] disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : 'Test R2 Storage'}
        </button>

        {testResults && (
          <div className="bg-white border border-[#EBEDE8] rounded-xl p-6">
            <h2 className="text-xl font-semibold text-[#333F3C] mb-4">Test Results</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}