import React, { useState, useRef, useEffect } from 'react';
import { Camera, Timer, FlipHorizontal, Download, Grid3x3, Users, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';
import LayoutSelection from './LayoutSelection';
import CameraView from './CameraView';
import PhotoPreview from './PhotoPreview';
import { photoAPI } from '../services/api';
import { useCamera } from '../hooks/useCamera';

const Photobooth = () => {
  const [currentStep, setCurrentStep] = useState('layout'); // layout, camera, preview
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerCount, setTimerCount] = useState(3);
  const [isMirrored, setIsMirrored] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const camera = useCamera();

  const handleLayoutSelect = async (layout) => {
    try {
      // Create new session
      const session = await photoAPI.createSession({
        layout_id: layout.id,
        layout_name: layout.name,
        photo_count: layout.count
      });

      setSelectedLayout(layout);
      setCurrentSession(session);
      setCurrentStep('camera');
      setCapturedPhotos([]);
      setCurrentPhotoIndex(0);

      // Start camera when entering camera view
      setTimeout(() => {
        camera.startCamera();
      }, 500);

      toast({
        title: "Session created!",
        description: `Ready to capture ${layout.count} photos for ${layout.name}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create photo session. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTakePhoto = async () => {
    if (isTimerActive || !camera.hasCamera || !currentSession) return;
    
    setIsTimerActive(true);
    setTimerCount(3);
    
    const countdown = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setTimeout(async () => {
            try {
              // Capture photo from camera
              const photoData = camera.capturePhoto();
              if (!photoData) {
                throw new Error('Failed to capture photo');
              }

              setIsUploading(true);

              // Upload photo to backend
              const photo = await photoAPI.capturePhoto({
                session_id: currentSession.id,
                photo_index: currentPhotoIndex,
                image_data: photoData
              });

              setCapturedPhotos(prev => [...prev, photo]);
              
              if (currentPhotoIndex + 1 < selectedLayout.count) {
                setCurrentPhotoIndex(prev => prev + 1);
                toast({
                  title: "Photo captured!",
                  description: `Photo ${currentPhotoIndex + 1} of ${selectedLayout.count} saved.`,
                });
              } else {
                // All photos captured, generate strip
                await generatePhotoStrip();
              }

              setIsUploading(false);
              setIsTimerActive(false);
              setTimerCount(3);
              
            } catch (error) {
              console.error('Photo capture error:', error);
              setIsUploading(false);
              setIsTimerActive(false);
              setTimerCount(3);
              
              toast({
                title: "Error",
                description: "Failed to capture photo. Please try again.",
                variant: "destructive"
              });
            }
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const generatePhotoStrip = async () => {
    try {
      const stripData = await photoAPI.generateStrip(currentSession.id);
      
      // Update session with strip info
      setCurrentSession(prev => ({
        ...prev,
        strip_url: stripData.strip_url,
        download_url: stripData.download_url,
        completed: true
      }));

      setCurrentStep('preview');
      camera.stopCamera();

      toast({
        title: "Photo strip ready!",
        description: "Your beautiful memories are ready for download.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate photo strip. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setCurrentStep('camera');
    camera.startCamera();
  };

  const handleNewSession = () => {
    setCurrentStep('layout');
    setSelectedLayout(null);
    setCurrentSession(null);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    camera.stopCamera();
  };

  const handleDownload = () => {
    if (currentSession && currentSession.download_url) {
      const link = document.createElement('a');
      link.href = photoAPI.getDownloadURL(currentSession.id);
      link.download = `photobooth_strip_${currentSession.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download started!",
        description: "Your photo strip is being downloaded.",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-pink-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-40 h-40 bg-blue-200 rounded-full blur-3xl opacity-25 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-amber-200 rounded-full blur-2xl opacity-20 animate-bounce"></div>
      </div>

      {/* Film Grain Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grain-texture"></div>

      {/* Hidden canvas for photo processing */}
      <canvas ref={camera.canvasRef} style={{ display: 'none' }} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif text-slate-700 mb-2 tracking-wide">
            about you...
          </h1>
          <p className="text-slate-500 text-lg font-light italic">
            capture the moments that matter
          </p>
        </div>

        {/* Main Content */}
        {currentStep === 'layout' && (
          <LayoutSelection onSelectLayout={handleLayoutSelect} />
        )}

        {currentStep === 'camera' && (
          <CameraView
            selectedLayout={selectedLayout}
            currentPhotoIndex={currentPhotoIndex}
            capturedPhotos={capturedPhotos}
            isTimerActive={isTimerActive}
            timerCount={timerCount}
            isMirrored={isMirrored}
            isUploading={isUploading}
            camera={camera}
            onTakePhoto={handleTakePhoto}
            onToggleMirror={() => setIsMirrored(!isMirrored)}
            onBack={handleNewSession}
          />
        )}

        {currentStep === 'preview' && (
          <PhotoPreview
            selectedLayout={selectedLayout}
            currentSession={currentSession}
            capturedPhotos={capturedPhotos}
            onRetake={handleRetake}
            onNewSession={handleNewSession}
            onDownload={handleDownload}
          />
        )}
      </div>
    </div>
  );
};

export default Photobooth;