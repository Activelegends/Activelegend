import React, { useEffect, useState } from 'react';
import type { SiteSettings } from '../types/settings';
import { settingsService } from '../services/settingsService';

export const SiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!settings) return <div>No settings found</div>;

  return (
    <div className="site-settings">
      <h1>Site Settings</h1>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="title">Site Title</label>
          <input
            type="text"
            id="title"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={settings.description}
            onChange={(e) => setSettings({ ...settings, description: e.target.value })}
          />
        </div>
        {/* Add more form fields for other settings */}
      </div>
    </div>
  );
}; 