import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Download, Calendar, User, Tag, MessageCircle } from 'lucide-react';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const response = await axios.get(`/api/complaints/${id}`);
      setComplaint(response.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch complaint');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = (filename) => {
    const link = document.createElement('a');
    link.href = `/uploads/${filename}`;
    link.download = filename;
    link.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {complaint?.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(complaint?.status)}`}>
                  {complaint?.status}
                </span>
                <span className="text-sm text-gray-500">
                  ID: {complaint?.id}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {complaint?.description}
                </p>
              </div>

              {complaint?.attachment && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Attachment
                  </h2>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <span className="text-sm text-gray-700">
                        {complaint.attachment}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(complaint.attachment)}
                      className="flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}

              {complaint?.adminComment && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Admin Comment
                  </h2>
                  <div className="p-4 bg-blue-50 rounded-md">
                    <p className="text-gray-700">{complaint.adminComment}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Complaint Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Created:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(complaint?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Category:</span>
                    <span className="ml-2 text-gray-900 capitalize">
                      {complaint?.category}
                    </span>
                  </div>

                  {complaint?.handlerName && (
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-600">Handler:</span>
                      <span className="ml-2 text-gray-900">
                        {complaint.handlerName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {new Date(complaint?.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Status Timeline
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Submitted</span>
                  </div>
                  {complaint?.status !== 'pending' && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">In Progress</span>
                    </div>
                  )}
                  {complaint?.status === 'resolved' && (
                    <div className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-gray-600">Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;