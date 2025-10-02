import React from "react";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome to Artori Admin Panel
              </h3>
              <p className="text-gray-600 text-lg">
                Manage exams, users, and monitor the application from this
                central dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Total Exams Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-blue-600 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-1">
                    Total Exams
                  </h4>
                  <p className="text-4xl font-black text-blue-600">12</p>
                </div>
              </div>
              <div className="text-blue-200">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Active Users Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-green-600 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-1">
                    Active Users
                  </h4>
                  <p className="text-4xl font-black text-green-600">1,247</p>
                </div>
              </div>
              <div className="text-green-200">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Questions Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-purple-600 shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-700 mb-1">
                    Questions
                  </h4>
                  <p className="text-4xl font-black text-purple-600">3,456</p>
                </div>
              </div>
              <div className="text-purple-200">
                <svg
                  className="w-16 h-16"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800">
              Recent Activity
            </h4>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-gray-700 font-medium">
                  New user registered: john.doe@example.com
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full">
                2 minutes ago
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg"></div>
                <span className="text-gray-700 font-medium">
                  Exam "Mathematics Advanced" was updated
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full">
                15 minutes ago
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-lg"></div>
                <span className="text-gray-700 font-medium">
                  Question added to "Physics Basics" subject
                </span>
              </div>
              <span className="text-sm text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full">
                1 hour ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
