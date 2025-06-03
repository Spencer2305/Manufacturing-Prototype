import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ClockIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  EyeIcon,
  PencilIcon,
  KeyIcon
} from '@heroicons/react/24/outline';

export default function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@company.com',
    phone: '+44 20 7123 4567',
    position: 'Warehouse Manager',
    department: 'Operations',
    company: 'Warehouse Solutions Ltd',
    address: '123 Industrial Park, London, UK',
    joinDate: '2022-03-15',
    lastLogin: '2024-01-15T09:30:00Z',
    status: 'Active'
  });

  const [activityLog] = useState([
    { action: 'Logged in', timestamp: '2024-01-15T09:30:00Z', device: 'Desktop - Chrome', ip: '192.168.1.100' },
    { action: 'Updated inventory item SKU-123456', timestamp: '2024-01-15T08:45:00Z', device: 'Desktop - Chrome', ip: '192.168.1.100' },
    { action: 'Generated sales report', timestamp: '2024-01-14T16:20:00Z', device: 'Mobile - Safari', ip: '192.168.1.105' },
    { action: 'Resolved critical alert', timestamp: '2024-01-14T14:15:00Z', device: 'Desktop - Chrome', ip: '192.168.1.100' },
    { action: 'Changed password', timestamp: '2024-01-13T10:30:00Z', device: 'Desktop - Chrome', ip: '192.168.1.100' }
  ]);

  const handleProfileUpdate = (field: string, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device: string) => {
    if (device.includes('Mobile')) return DevicePhoneMobileIcon;
    return ComputerDesktopIcon;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Profile</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
        </div>

        <div className="space-y-6">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <UserIcon className="h-12 w-12 text-gray-600" />
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{userProfile.firstName} {userProfile.lastName}</h2>
                  <p className="text-blue-100 text-lg">{userProfile.position}</p>
                  <p className="text-blue-200">{userProfile.department} • {userProfile.company}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {userProfile.status}
                    </span>
                    <span className="text-blue-200 text-sm">
                      Joined {formatDate(userProfile.joinDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.firstName}
                        onChange={(e) => handleProfileUpdate('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.lastName}
                        onChange={(e) => handleProfileUpdate('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.lastName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => handleProfileUpdate('email', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {isEditing ? (
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{userProfile.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userProfile.position}
                        onChange={(e) => handleProfileUpdate('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-gray-900">{userProfile.position}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    {isEditing ? (
                      <select
                        value={userProfile.department}
                        onChange={(e) => handleProfileUpdate('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Operations">Operations</option>
                        <option value="Management">Management</option>
                        <option value="Sales">Sales</option>
                        <option value="IT">IT</option>
                        <option value="Finance">Finance</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">{userProfile.department}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <div className="flex items-center space-x-2">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{userProfile.company}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{userProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Security Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <ShieldCheckIcon className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security & Access</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 3 days ago</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors">
                      Change
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Not enabled</p>
                    </div>
                    <button className="px-3 py-1 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      Enable
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Last Login</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatDateTime(userProfile.lastLogin)}</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Account Status</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <div className="flex items-center space-x-3 mb-6">
              <EyeIcon className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>

            <div className="space-y-4">
              {activityLog.map((activity, index) => {
                const DeviceIcon = getDeviceIcon(activity.device);
                return (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-white rounded-lg">
                      <DeviceIcon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{formatDateTime(activity.timestamp)}</span>
                        <span>•</span>
                        <span>{activity.device}</span>
                        <span>•</span>
                        <span>{activity.ip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <KeyIcon className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </button>

              <button className="p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ShieldCheckIcon className="h-6 w-6 text-green-600 mb-2" />
                <h4 className="font-medium text-gray-900">Security Settings</h4>
                <p className="text-sm text-gray-600">Manage security preferences</p>
              </button>

              <button className="p-4 text-left border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-600">
                <UserIcon className="h-6 w-6 mb-2" />
                <h4 className="font-medium">Deactivate Account</h4>
                <p className="text-sm">Temporarily disable your account</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 