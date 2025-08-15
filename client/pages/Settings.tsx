import React, { useState, useEffect } from 'react';
import { User, Palette, Save, Camera, Upload } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance'>('account');
  const [accountData, setAccountData] = useState({
    name: 'Dr. Smith',
    email: 'dr.smith@joinwise.com'
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [appearanceData, setAppearanceData] = useState(() => {
    // Load saved appearance settings from localStorage
    const saved = localStorage.getItem('appearanceSettings');
    return saved ? JSON.parse(saved) : {
      font: 'Inter',
      fontSize: 'Medium',
      theme: 'Light'
    };
  });

  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  ];

  const handleAccountSave = () => {
    // Handle account save logic
    console.log('Saving account data:', accountData);
  };

  const handleAppearanceSave = () => {
    // Handle appearance save logic
    console.log('Saving appearance data:', appearanceData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSetDefault = () => {
    setProfileImage(null);
  };

  return (
    <div className="p-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'account' && (
          <div className="medical-card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Account</h2>
              <p className="text-sm text-muted-foreground">
                Manage your account settings and email preferences.
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <label className="bg-medical-blue hover:bg-medical-blue-dark text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        onClick={handleSetDefault}
                        className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                      >
                        Set Default
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload a photo to personalize your profile. JPG, PNG or GIF (max 5MB).
                    </p>
                  </div>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={accountData.name}
                  onChange={(e) => setAccountData({ ...accountData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This is the name that will be displayed on your profile.
                </p>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={accountData.email}
                  onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for notifications and account recovery.
                </p>
              </div>

              {/* Save Button */}
              <button
                onClick={handleAccountSave}
                className="bg-medical-blue hover:bg-medical-blue-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Account</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="medical-card p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2">Appearance</h2>
              <p className="text-sm text-muted-foreground">
                Customize the look and feel of this application.
              </p>
            </div>

            <div className="space-y-6">
              {/* Font Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Font
                </label>
                <select
                  value={appearanceData.font}
                  onChange={(e) => setAppearanceData({ ...appearanceData, font: e.target.value })}
                  className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                >
                  <option value="Inter (Default)">Inter (Default)</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Set the font for the application.
                </p>
              </div>

              {/* Theme Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Theme
                </label>
                <div className="space-y-3">
                  {['Light', 'Dark'].map((theme) => (
                    <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        value={theme}
                        checked={appearanceData.theme === theme}
                        onChange={(e) => setAppearanceData({ ...appearanceData, theme: e.target.value })}
                        className="w-4 h-4 text-medical-blue border-border focus:ring-medical-blue"
                      />
                      <span className="text-sm text-foreground">{theme}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleAppearanceSave}
                className="bg-medical-blue hover:bg-medical-blue-dark text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Appearance</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
