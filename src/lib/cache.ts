import { db } from './db';

// Simple in-memory cache with TTL (Time To Live)
class SettingsCache {
  private cache = new Map<string, { value: any; expires: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  async get(key: string): Promise<any> {
    const cached = this.cache.get(key);
    
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }
    
    // Cache expired or not found, fetch from database
    try {
      const setting = await db.siteSetting.findUnique({
        where: { key }
      });
      
      if (setting) {
        this.set(key, setting.value);
        return setting.value;
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching setting ${key} from database:`, error);
      return cached ? cached.value : null; // Return stale cache if available
    }
  }

  set(key: string, value: any, ttl: number = this.defaultTTL): void {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get all settings with bulk optimization
  async getAll(): Promise<Record<string, any>> {
    const cachedAll = this.cache.get('all_settings');
    
    if (cachedAll && cachedAll.expires > Date.now()) {
      return cachedAll.value;
    }
    
    try {
      const settings = await db.siteSetting.findMany({
        orderBy: { key: 'asc' }
      });
      
      const settingsObj = settings.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Record<string, any>);
      
      this.set('all_settings', settingsObj);
      return settingsObj;
    } catch (error) {
      console.error('Error fetching all settings from database:', error);
      return cachedAll ? cachedAll.value : {};
    }
  }

  // Update cache when settings are modified
  async update(key: string, value: any): Promise<void> {
    this.set(key, value);
    
    // Also update the all_settings cache
    const allSettings = await this.getAll();
    allSettings[key] = value;
    this.set('all_settings', allSettings);
  }
}

export const settingsCache = new SettingsCache();

// Cache invalidation helper
export function invalidateCache(keys?: string[]): void {
  if (keys && keys.length > 0) {
    keys.forEach(key => settingsCache.delete(key));
  } else {
    settingsCache.clear();
  }
}

// Cache warming - preload frequently accessed settings
export async function warmCache(): Promise<void> {
  try {
    const frequentSettings = [
      'site_name',
      'site_description',
      'site_logo',
      'contact_email',
      'contact_phone',
      'footer_address',
      'footer_get_in_touch'
    ];
    
    for (const key of frequentSettings) {
      await settingsCache.get(key);
    }
    
    console.log('Settings cache warmed successfully');
  } catch (error) {
    console.error('Error warming settings cache:', error);
  }
}