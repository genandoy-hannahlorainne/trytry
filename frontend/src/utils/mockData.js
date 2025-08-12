// Mock data for photobooth functionality
export const mockPhotos = [
  {
    id: 1,
    timestamp: new Date().toISOString(),
    url: 'mock-photo-1',
    filter: 'vintage'
  },
  {
    id: 2,
    timestamp: new Date().toISOString(),
    url: 'mock-photo-2', 
    filter: 'dreamy'
  },
  {
    id: 3,
    timestamp: new Date().toISOString(),
    url: 'mock-photo-3',
    filter: 'nostalgic'
  },
  {
    id: 4,
    timestamp: new Date().toISOString(),
    url: 'mock-photo-4',
    filter: 'soft'
  }
];

// Mock camera settings
export const cameraSettings = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'user'
  },
  audio: false
};

// Mock filter effects
export const filterEffects = {
  vintage: {
    name: 'Vintage',
    sepia: 0.3,
    contrast: 1.1,
    brightness: 0.9,
    grain: true
  },
  dreamy: {
    name: 'Dreamy',
    blur: 0.5,
    brightness: 1.1,
    saturation: 0.8,
    softFocus: true
  },
  nostalgic: {
    name: 'Nostalgic',
    sepia: 0.2,
    contrast: 0.9,
    vignette: true,
    grain: true
  }
};