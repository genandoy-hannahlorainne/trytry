import React, { useState, useRef, useEffect } from 'react';
import { Camera, Timer, FlipHorizontal, Download, Grid3x3, Users, Image } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';
import LayoutSelection from './LayoutSelection';
import CameraView from './CameraView';
import PhotoPreview from './PhotoPreview';
import { mockPhotos } from '../utils/mockData';

const Photobooth = () => {
  const [currentStep, setCurrentStep] = useState('layout'); // layout, camera, preview
  const [selectedLayout, setSelectedLayout] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerCount, setTimerCount] = useState(3);
  const [isMirrored, setIsMirrored] = useState(true);
  const { toast } = useToast();

  // Mock camera functionality
  const handleTakePhoto = () => {
    if (isTimerActive) return;
    
    setIsTimerActive(true);
    setTimerCount(3);
    
    const countdown = setInterval(() => {
      setTimerCount(prev => {
        if (prev <= 1) {
          clearInterval(countdown);
          setTimeout(() => {
            // Simulate photo capture with mock data
            const newPhoto = mockPhotos[Math.floor(Math.random() * mockPhotos.length)];
            setCapturedPhotos(prev => [...prev, newPhoto]);
            
            if (currentPhotoIndex + 1 < selectedLayout.count) {
              setCurrentPhotoIndex(prev => prev + 1);
            } else {
              setCurrentStep('preview');
            }
            
            setIsTimerActive(false);
            setTimerCount(3);
            
            toast({
              title: "Photo captured!",
              description: `Photo ${currentPhotoIndex + 1} of ${selectedLayout.count} taken.`,
            });
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLayoutSelect = (layout) => {
    setSelectedLayout(layout);
    setCurrentStep('camera');
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
    setCurrentStep('camera');
  };

  const handleNewSession = () => {
    setCurrentStep('layout');
    setSelectedLayout(null);
    setCapturedPhotos([]);
    setCurrentPhotoIndex(0);
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
            onTakePhoto={handleTakePhoto}
            onToggleMirror={() => setIsMirrored(!isMirrored)}
            onBack={() => setCurrentStep('layout')}
          />
        )}

        {currentStep === 'preview' && (
          <PhotoPreview
            selectedLayout={selectedLayout}
            capturedPhotos={capturedPhotos}
            onRetake={handleRetake}
            onNewSession={handleNewSession}
          />
        )}
      </div>
    </div>
  );
};

export default Photobooth;