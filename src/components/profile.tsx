import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Define TypeScript interface for user profile
interface UserProfile {
  username: string;
  email: string;
  fullName: string;
  address: string;
}

// Define TypeScript interface for AuthContext
interface AuthContextType {
  user: UserProfile | null;
  updateProfile?: (profile: Partial<UserProfile>) => Promise<void>;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth() as AuthContextType;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    username: '',
    email: '',
    fullName: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<UserProfile & { general?: string }>>({});

  // Populate profile data when user is available
  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user); // Debug log
      setProfile({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Log AuthContext to debug updateProfile
  useEffect(() => {
    console.log('AuthContext:', { user, updateProfile }); // Debug log
  }, [user, updateProfile]);

  // Client-side validation for editable fields
  const validateForm = (): boolean => {
    const newErrors: Partial<UserProfile> = {};
    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profile.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    console.log('Validation errors:', newErrors); // Debug log
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    if (!updateProfile) {
      console.error('updateProfile function is not available'); // Debug log
      setErrors({ general: 'Profile update is not available at this time.' });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Submitting profile:', { fullName: profile.fullName, address: profile.address }); // Debug log
      await updateProfile({ fullName: profile.fullName, address: profile.address });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update profile error:', err); // Debug log
      setErrors({ general: 'Failed to update profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Please log in to view your profile.</h2>
        <Link to="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Profile Card */}
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 h-32 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white -mb-12">
              <User size={48} className="text-blue-600" />
            </div>
          </div>
          <div className="pt-16 pb-8 px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {profile.fullName || profile.username}
            </h2>
            <p className="text-gray-600 mb-6">Manage your SimpleShop profile</p>

            {/* Error Messages (only shown during editing) */}
            {isEditing && errors.general && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Profile Form */}
            <div className="max-w-md mx-auto">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profile.username}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profile.email}
                      className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                      disabled
                    />
                  </div>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                      disabled={isLoading}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={profile.address}
                      onChange={handleChange}
                      className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your address"
                      rows={4}
                      disabled={isLoading}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                        isLoading
                          ? 'bg-blue-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } text-white transition-colors`}
                    >
                      <Save size={20} />
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                      className={`flex-1 py-2 px-4 rounded-md ${
                        isLoading
                          ? 'bg-gray-200 cursor-not-allowed'
                          : 'bg-gray-300 hover:bg-gray-400'
                      } text-gray-800 transition-colors`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 text-left">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Username</p>
                    <p className="text-gray-900">{profile.username || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{profile.email || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-gray-900">{profile.fullName || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address</p>
                    <p className="text-gray-900">{profile.address || 'Not set'}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={20} />
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <Link to="/orders" className="text-blue-600 hover:underline mr-4">
            View My Orders
          </Link>
          <Link to="/" className="text-blue-600 hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Profile;