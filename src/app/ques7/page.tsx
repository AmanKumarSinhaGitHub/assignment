"use client";
import React from 'react';
import Link from 'next/link';
import { useToast } from './components/ToastContext';
import { ToastProvider } from './components/ToastContext';

const ToastContent: React.FC = () => {
  const { showSuccess, showError, showInfo } = useToast();

  const handleSuccess = () => {
    showSuccess('🎉 Success! Operation completed successfully!');
  };

  const handleError = () => {
    showError('🔴 Error! Something went wrong. Please try again.');
  };

  const handleInfo = () => {
    showInfo('💡 Info: This is an informational message.');
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
          <h1 className="text-3xl font-bold text-gray-900">Toast Notifications</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="mb-6 text-gray-600">
            <p className="text-center">
              Test our custom toast notification system. Click the buttons below to trigger different types of toasts.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleSuccess}
              className="w-full px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show Success Toast
            </button>

            <button
              onClick={handleError}
              className="w-full px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show Error Toast
            </button>

            <button
              onClick={handleInfo}
              className="w-full px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Show Info Toast
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              The toasts will appear in the bottom-right corner and automatically dismiss after 3 seconds.
              You can also manually dismiss them by clicking the close button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastDemo: React.FC = () => {
  return (
    <ToastProvider>
      <ToastContent />
    </ToastProvider>
  );
};

export default ToastDemo;