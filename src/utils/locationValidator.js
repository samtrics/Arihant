import { supabase } from '../supabaseClient';
import { Geolocation } from '@capacitor/geolocation';

export async function verifyLocationEligibility() {
  try {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        return { isEligible: false, error: "Location access denied. We require location verification to ensure we can deliver to your area." };
      }
    }

    const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
    const { latitude, longitude } = position.coords;
    
    // 1. Get user's city via Nominatim
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const geoData = await geoRes.json();
    
    if (!geoData || !geoData.address) {
      return { isEligible: false, error: "Could not determine your location." };
    }

    const userCity = geoData.address.city || geoData.address.town || geoData.address.state_district || geoData.address.county || "";
    
    if (!userCity) {
      return { isEligible: false, error: "Could not identify your city from GPS coordinates." };
    }

    // 2. Fetch Global Presence from Supabase
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'corporate_info')
      .single();

    if (error || !data) {
      // Failsafe: if settings are completely missing, allow to avoid hard-locking the system
      console.warn("Could not load corporate_info. Falling back to allowed.", error);
      return { isEligible: true, city: userCity };
    }

    const locations = data.value?.locations || [];
    
    if (locations.length === 0) {
      // If no global presence is defined, assume unrestricted delivery
      return { isEligible: true, city: userCity };
    }

    // 3. Match user city with any of the global presence locations
    const normalizedUserCity = userCity.toLowerCase().trim();
    
    const isMatch = locations.some(loc => {
      if (!loc.name) return false;
      const normalizedLocName = loc.name.toLowerCase().trim();
      // Loose matching: Check if the GPS city contains the setting name or vice versa
      return normalizedUserCity.includes(normalizedLocName) || normalizedLocName.includes(normalizedUserCity);
    });

    if (isMatch) {
      return { isEligible: true, city: userCity };
    } else {
      return { 
        isEligible: false, 
        error: `We currently do not serve your area (${userCity}). Our global presence is limited to our configured regions.` 
      };
    }

  } catch (err) {
    console.error("Verification error:", err);
    return { isEligible: false, error: "An error occurred while verifying your location eligibility." };
  }
}
