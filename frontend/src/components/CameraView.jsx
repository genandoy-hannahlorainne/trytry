import React, { useRef, useEffect, useState } from 'react';
import { Camera, Timer, FlipHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const CameraView = ({
  selectedLayout,
  currentPhotoIndex,
  capturedPhotos,
  isTimerActive,
  timerCount,
  isMirrored,
  isUploading,
  camera,
  onTakePhoto,
  onToggleMirror,
  onBack
}) => {

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-slate-600 hover:text-slate-800 hover:bg-pink-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Layouts
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-serif text-slate-700 mb-2">
            {selectedLayout.name}
          </h2>
          <div className="text-sm text-slate-500">
            Photo {currentPhotoIndex + 1} of {selectedLayout.count}
          </div>
        </div>

        <div className="w-24"></div> {/* Spacer for centering */}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Camera Preview */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden bg-gradient-to-br from-pink-50/80 to-blue-50/80 backdrop-blur-sm border-pink-100/50">
            <CardContent className="p-6">
              <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden">
                {/* Real Camera Feed */}
                <video
                  ref={camera.videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''} transition-transform duration-300`}
                  style={{ display: camera.hasCamera ? 'block' : 'none' }}
                />

                {/* Camera Error Display */}
                {!camera.hasCamera && camera.cameraError && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 via-blue-100 to-amber-100 flex items-center justify-center">
                    <div className="text-center text-red-500 p-6">
                      <Camera className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-semibold mb-2">Camera Issue</p>
                      <p className="text-sm">{camera.cameraError}</p>
                      <Button 
                        onClick={camera.startCamera}
                        className="mt-4 bg-pink-400 hover:bg-pink-500"
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}

                {/* Loading Display */}
                {!camera.hasCamera && !camera.cameraError && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 via-blue-100 to-amber-100 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-slate-400 mb-4 mx-auto animate-pulse" />
                      <p className="text-slate-500">Starting camera...</p>
                    </div>
                  </div>
                )}

                {/* Timer Overlay */}
                {isTimerActive && timerCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-white text-8xl font-bold animate-pulse">
                      {timerCount}
                    </div>
                  </div>
                )}

                {/* Upload Overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p>Saving photo...</p>
                    </div>
                  </div>
                )}

                {/* Vintage Film Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-white/20 to-transparent"></div>
                </div>
              </div>

              {/* Camera Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onToggleMirror}
                  className="bg-white/80 hover:bg-pink-50 border-pink-200"
                  disabled={isTimerActive || isUploading}
                >
                  <FlipHorizontal className="w-5 h-5 mr-2" />
                  Mirror
                </Button>

                <Button
                  size="lg"
                  onClick={onTakePhoto}
                  disabled={isTimerActive || isUploading || !camera.hasCamera}
                  className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {isTimerActive ? 'Taking Photo...' : isUploading ? 'Saving...' : 'Take Photo'}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/80 hover:bg-blue-50 border-blue-200"
                  disabled={isTimerActive || isUploading}
                >
                  <Timer className="w-5 h-5 mr-2" />
                  Timer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photo Strip Preview */}
        <div>
          <Card className="bg-white/80 backdrop-blur-sm border-pink-100/50">
            <CardContent className="p-6">
              <h3 className="text-lg font-serif text-slate-700 mb-4">
                Your Strip
              </h3>
              
              <div className="space-y-3">
                {Array.from({ length: selectedLayout.count }).map((_, index) => (
                  <div 
                    key={index}
                    className={`aspect-square rounded-lg border-2 border-dashed transition-all duration-300 ${
                      index < capturedPhotos.length
                        ? 'border-green-300 bg-green-50'
                        : index === currentPhotoIndex
                        ? 'border-pink-300 bg-pink-50 animate-pulse'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    {index < capturedPhotos.length ? (
                      <div className="w-full h-full bg-gradient-to-br from-pink-200 to-blue-200 rounded-lg flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-600" />
                      </div>
                    ) : index === currentPhotoIndex ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-pink-400 font-serif">Next</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-400 text-sm">{index + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50/50 rounded-lg border border-amber-200/50">
                <p className="text-xs text-amber-700 font-light italic text-center">
                  "about you..."
                </p>
                <p className="text-xs text-amber-600 mt-1 text-center">
                  - captured {new Date().toLocaleDateString()} -
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CameraView;