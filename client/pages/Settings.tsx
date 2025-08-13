import React, { useState } from 'react';
import { User, Palette, Save } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'appearance'>('account');
  const [accountData, setAccountData] = useState({
    name: 'Dr. Smith',
    email: 'dr.smith@joinwise.com'
  });
  const [appearanceData, setAppearanceData] = useState({
    font: 'Inter (Default)',
    theme: 'Light'
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
