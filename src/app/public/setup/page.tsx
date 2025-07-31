"use client";

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function PublicProfileSetup() {
  const { user } = useUser();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: user?.fullName || '',
    bio: '',
    isJourneyPublic: false,
    allowSpecificEntries: true,
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Check if user already has a public profile
  useEffect(() => {
    checkExistingProfile();
  }, []);

  const checkExistingProfile = async () => {
    try {
      const response = await fetch('/api/public/profile-status');
      if (response.ok) {
        const data = await response.json();
        if (data.hasProfile) {
          // User already has a public profile, redirect to it
          router.push(`/public/profile/${data.profile.username}`);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking existing profile:', error);
    }
  };

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await fetch(`/api/public/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Handle username change with debounce
  const handleUsernameChange = (value: string) => {
    // Only allow alphanumeric characters and underscores
    const cleanValue = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setFormData(prev => ({ ...prev, username: cleanValue }));
    
    // Debounce username check
    setTimeout(() => {
      if (cleanValue === formData.username) {
        checkUsernameAvailability(cleanValue);
      }
    }, 500);
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Profile picture must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.fullName) {
      alert('Please fill in all required fields');
      return;
    }

    if (usernameAvailable === false) {
      alert('Please choose an available username');
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('username', formData.username);
      submitData.append('fullName', formData.fullName);
      submitData.append('bio', formData.bio);
      submitData.append('isJourneyPublic', formData.isJourneyPublic.toString());
      submitData.append('allowSpecificEntries', formData.allowSpecificEntries.toString());
      
      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }

      const response = await fetch('/api/public/create-profile', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to public platform
        router.push(`/public/profile/${data.username}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('An error occurred while creating your profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFEFE] py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-[#333F3C] mb-2">
            Create Your Public Profile
          </h1>
          <p className="text-[#333F3C] opacity-75">
            Share your memoir journey with the world and connect with fellow writers
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-[#EBEDE8] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture */}
            <div className="text-center">
              <div className="mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#EBEDE8] flex items-center justify-center overflow-hidden">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-[#333F3C]">👤</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-sm text-[#004838] hover:underline"
                >
                  {profilePicture ? 'Change Photo' : 'Add Profile Photo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#333F3C] mb-2">
                Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="your_username"
                  className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                  required
                />
                {checkingUsername && (
                  <div className="absolute right-3 top-3">
                    <div className="w-5 h-5 border-2 border-[#004838] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {formData.username && !checkingUsername && (
                <p className={`text-sm mt-1 ${usernameAvailable === true ? 'text-green-600' : usernameAvailable === false ? 'text-red-600' : 'text-gray-500'}`}>
                  {usernameAvailable === true && '✓ Username is available'}
                  {usernameAvailable === false && '✗ Username is already taken'}
                  {usernameAvailable === null && 'Username must be at least 3 characters'}
                </p>
              )}
              <p className="text-xs text-[#333F3C] opacity-75 mt-1">
                Your public profile will be available at: memoirvault.com/public/profile/{formData.username || 'username'}
              </p>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#333F3C] mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Your full name"
                className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-[#333F3C] mb-2">
                Bio (Optional)
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell others about yourself and your memoir journey..."
                rows={4}
                className="w-full p-3 border border-[#EBEDE8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-none"
              />
              <p className="text-xs text-[#333F3C] opacity-75 mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4 p-4 bg-[#EBEDE8] rounded-lg">
              <h3 className="font-medium text-[#333F3C]">Privacy Settings</h3>
              
              {/* Make all entries public */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="isJourneyPublic"
                  checked={formData.isJourneyPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isJourneyPublic: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="isJourneyPublic" className="text-sm font-medium text-[#333F3C] cursor-pointer">
                    Make all my entries public
                  </label>
                  <p className="text-xs text-[#333F3C] opacity-75">
                    If enabled, all your memoir entries will be visible to other users. You can change this later.
                  </p>
                </div>
              </div>

              {/* Allow specific entry control */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="allowSpecificEntries"
                  checked={formData.allowSpecificEntries}
                  onChange={(e) => setFormData(prev => ({ ...prev, allowSpecificEntries: e.target.checked }))}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="allowSpecificEntries" className="text-sm font-medium text-[#333F3C] cursor-pointer">
                    Allow me to choose specific entries to make public
                  </label>
                  <p className="text-xs text-[#333F3C] opacity-75">
                    You'll be able to individually control which entries are public, regardless of the setting above.
                  </p>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Important Notice</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Other users can view your public entries but cannot download your media files</li>
                <li>• You can switch back to private mode anytime (with a 15-second delay)</li>
                <li>• Your private memoir data remains completely separate and secure</li>
                <li>• You have full control over what content becomes public</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border border-[#EBEDE8] text-[#333F3C] px-6 py-3 rounded-lg font-medium hover:bg-[#EBEDE8] transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || usernameAvailable === false || !formData.username || !formData.fullName}
                className="flex-1 bg-[#004838] text-[#E2FB6C] px-6 py-3 rounded-lg font-medium hover:bg-[#073127] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Creating Profile...' : 'Create Public Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}