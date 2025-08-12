import React from 'react';
import { Download, RotateCcw, Camera, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useToast } from '../hooks/use-toast';

const PhotoPreview = ({ selectedLayout, currentSession, capturedPhotos, onRetake, onNewSession, onDownload }) => {
  const { toast } = useToast();

  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-8">
        <h2 className="text-4xl font-serif text-slate-700 mb-3">
          Beautiful Memories
        </h2>
        <p className="text-slate-500 font-light italic">
          Your photobooth strip is ready
        </p>
      </div>

      {/* Photo Strip Display */}
      <Card className="inline-block bg-white shadow-2xl border-0 mb-8 transform hover:scale-105 transition-transform duration-500">
        <CardContent className="p-8">
          {/* Polaroid Style Frame */}
          <div className="bg-white p-4 shadow-inner">
            <div className={`grid ${selectedLayout.grid} gap-2 w-80 mx-auto`}>
              {capturedPhotos.map((photo, index) => (
                <div 
                  key={index}
                  className="aspect-square bg-gradient-to-br from-pink-200 via-blue-200 to-amber-200 rounded-sm relative overflow-hidden"
                >
                  {/* Real Photo Display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-6 h-6 text-slate-600" />
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100/50 to-blue-100/50"></div>
                  </div>
                  
                  {/* Film grain effect */}
                  <div className="absolute inset-0 opacity-10 grain-texture"></div>
                  
                  {/* Light leak effect */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-yellow-200/60 to-transparent rounded-full"></div>
                </div>
              ))}
            </div>
            
            {/* Handwritten Caption */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              <p className="text-slate-600 font-serif italic text-lg">
                "about you..."
              </p>
              <p className="text-slate-400 text-xs mt-2">
                {new Date().toLocaleDateString()} • {selectedLayout.name}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          onClick={onDownload}
          className="bg-gradient-to-r from-pink-400 to-blue-400 hover:from-pink-500 hover:to-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Strip
        </Button>

        <Button
          variant="outline"
          onClick={onRetake}
          className="bg-white/80 hover:bg-pink-50 border-pink-200 px-6 py-3 rounded-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Retake Photos
        </Button>

        <Button
          variant="outline"
          onClick={onNewSession}
          className="bg-white/80 hover:bg-blue-50 border-blue-200 px-6 py-3 rounded-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Share Message */}
      <div className="mt-12 p-6 bg-gradient-to-r from-pink-50/80 to-blue-50/80 rounded-2xl border border-pink-100/50">
        <Heart className="w-6 h-6 text-pink-400 mx-auto mb-3" />
        <p className="text-slate-600 font-light italic">
          "These moments of you will live forever in frames of time..."
        </p>
        <p className="text-slate-400 text-sm mt-2">
          Share your memories and let them inspire others
        </p>
      </div>
    </div>
  );
};

export default PhotoPreview;