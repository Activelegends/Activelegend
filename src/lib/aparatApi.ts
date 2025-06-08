const APARAT_API_BASE = 'https://www.aparat.com/etc/api';

export async function fetchAparatVideoInfo(videoHash: string) {
  try {
    const response = await fetch(`${APARAT_API_BASE}/video/videohash/${videoHash}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Aparat video info:', error);
    throw error;
  }
} 