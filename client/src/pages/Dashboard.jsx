import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Plus, Eye, Clock, CheckCircle, AlertCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints/my');
      setComplaints(response.data);
    } catch (error) {
      setError('Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-progress':
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
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

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in-progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your complaints and track their progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Complaints" value={stats.total} icon={<FileText className="h-8 w-8 text-primary-600" />} />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="h-8 w-8 text-yellow-600" />} color="text-yellow-600" />
        <StatCard title="In Progress" value={stats.inProgress} icon={<AlertCircle className="h-8 w-8 text-blue-600" />} color="text-blue-600" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle className="h-8 w-8 text-green-600" />} color="text-green-600" />
      </div>

      {/* Submit Button */}
      <div className="mb-8">
        <Link
          to="/complaint/new"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Submit New Complaint</span>
        </Link>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Complaints</h2>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700">
            {error}
          </div>
        )}

        {complaints.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No complaints submitted yet</p>
            <Link
              to="/complaint/new"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Submit your first complaint
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusIcon(complaint.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {complaint.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {complaint.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>Category: {complaint.category}</span>
                      <span>Created: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      {complaint.handlerName && (
                        <span>Handler: {complaint.handlerName}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <Link
                      to={`/complaint/${complaint._id}`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${color || 'text-gray-900'}`}>{value}</p>
      </div>
      {icon}
    </div>
  </div>
);

export default Dashboard;
