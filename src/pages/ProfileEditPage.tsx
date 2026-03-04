import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { uploadToCloudinary } from '@/services/cloudinaryService';
import { toast } from 'sonner';
import MobileBottomNav from '@/components/MobileBottomNav';
import {
  ArrowLeft,
  Camera,
  Edit3,
  Check,
} from 'lucide-react';

const ProfileEditPage = () => {
  const navigate = useNavigate();
  const { user, userProfile, updateUserProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (userProfile?.avatar) {
      setAvatarUrl(userProfile.avatar);
    } else if (user?.photoURL) {
      setAvatarUrl(user.photoURL);
    }
  }, [userProfile, user]);

  useEffect(() => {
    const currentName = userProfile?.name || userProfile?.username || user?.email?.split('@')[0] || 'User';
    setNameInput(currentName);
  }, [userProfile, user]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    try {
      const result = await uploadToCloudinary(file);
      await updateUserProfile({ avatar: result.secure_url });
      setAvatarUrl(result.secure_url);
      toast.success('Profile photo updated!');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setSavingName(true);
    try {
      await updateUserProfile({ name: nameInput.trim() });
      setIsEditingName(false);
      toast.success('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const displayName = userProfile?.name || userProfile?.username || user?.email?.split('@')[0] || 'User';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-24" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Blue Gradient Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 pt-12 pb-20 px-4 rounded-b-[2rem]">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          {/* Page Title */}
          <h1 className="text-center text-white text-lg font-semibold mb-8">Profile</h1>

          {/* Profile Photo */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-white/30 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-4xl font-bold">{initials}</span>
                </div>
              )}
              {/* Camera Icon Overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="absolute bottom-1 right-1 w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-blue-600 transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            {/* Name Section with Edit */}
            <div className="flex items-center gap-2 mb-1">
              {isEditingName ? (
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="bg-white/20 text-white text-xl font-bold text-center px-4 py-1 rounded-lg border-2 border-white/40 focus:outline-none focus:border-white"
                  autoFocus
                  disabled={savingName}
                />
              ) : (
                <h2 className="text-white text-xl font-bold">{displayName}</h2>
              )}
              <button
                onClick={() => {
                  if (isEditingName) {
                    handleSaveName();
                  } else {
                    setIsEditingName(true);
                  }
                }}
                disabled={savingName}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              >
                {isEditingName ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Edit3 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <p className="text-white/90 text-sm">
              {user?.email || 'sreerasthusilver@gmail.com'}
            </p>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </>
  );
};

export default ProfileEditPage;
