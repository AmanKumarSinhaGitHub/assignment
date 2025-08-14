"use client";
import { useState } from 'react';
import Link from 'next/link';

interface ApiResponse {
  message?: string;
  error?: string;
  requestNumber?: number;
  remainingRequests?: number;
  resetTime?: string;
  retryAfter?: number;
}

export default function RateLimiterTest() {
  const [responses, setResponses] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await fetch('/ques4/api/limited');
      const data: ApiResponse = await res.json();

      // Add response to the beginning of the list
      setResponses(prev => [{
        ...data,
        message: res.ok ? data.message : `Error ${res.status}: ${data.error}`,
      }, ...prev]);
    } catch (error: unknown) {
      setResponses(prev => [{
        error: 'Failed to fetch API',
      }, ...prev]);
    } finally {
      setLoading(false);
    }
  };

  const clearResponses = () => {
    setResponses([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">API Rate Limiter Test</h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 bg-blue-600 text-white">
            <h2 className="text-xl font-semibold">Rate Limit: 10 requests per minute</h2>
            <p className="mt-2 text-blue-100">
              Test the rate limiter by clicking the button below. After 10 requests within a minute,
              you&apos;ll receive a 429 Too Many Requests response.
            </p>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <button
                onClick={callApi}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
                         flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Calling API...
                  </>
                ) : (
                  'Make API Request'
                )}
              </button>
              <button
                onClick={clearResponses}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 
                         transition-all duration-200"
              >
                Clear Log
              </button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium text-gray-700">Response Log</h3>
              </div>
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {responses.map((response, index) => (
                  <div
                    key={index}
                    className={`p-4 ${response.error ? 'bg-red-50' : 'hover:bg-gray-50'
                      }`}
                  >
                    {response.error ? (
                      <div className="text-red-600">
                        <p className="font-medium">{response.error}</p>
                        {response.retryAfter && (
                          <p className="text-sm mt-1">
                            Try again in {response.retryAfter} seconds
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-900">{response.message}</p>
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          <span>Request #{response.requestNumber}</span>
                          <span>{response.remainingRequests} requests remaining</span>
                          <span>Resets at: {new Date(response.resetTime || '').toLocaleTimeString()}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {responses.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    No requests made yet. Click the button above to test the rate limiter.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
