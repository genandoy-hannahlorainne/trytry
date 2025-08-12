import React from 'react';
import { Grid3x3, Users, Image, Camera } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const layouts = [
  {
    id: 'layout-a',
    name: 'Classic Duo',
    count: 2,
    icon: Image,
    description: 'Two perfect moments',
    grid: 'grid-cols-2'
  },
  {
    id: 'layout-b', 
    name: 'Triple Story',
    count: 3,
    icon: Grid3x3,
    description: 'A trilogy of memories',
    grid: 'grid-cols-3'
  },
  {
    id: 'layout-c',
    name: 'Quad Vision',
    count: 4,
    icon: Users,
    description: 'Four snapshots of you',
    grid: 'grid-cols-2 grid-rows-2'
  },
  {
    id: 'layout-d',
    name: 'Memory Gallery',
    count: 6,
    icon: Camera,
    description: 'Six frames of forever',
    grid: 'grid-cols-3 grid-rows-2'
  }
];

const LayoutSelection = ({ onSelectLayout }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-slate-600 mb-4">
          Choose Your Story
        </h2>
        <p className="text-slate-500 font-light">
          Select how many moments you'd like to capture
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {layouts.map((layout) => {
          const IconComponent = layout.icon;
          return (
            <Card 
              key={layout.id}
              className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-pink-100/50 hover:bg-pink-50/90"
              onClick={() => onSelectLayout(layout)}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-6 relative">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-100 to-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-slate-600" />
                  </div>
                  
                  {/* Preview Grid */}
                  <div className={`mt-4 grid ${layout.grid} gap-1 w-12 h-8 mx-auto`}>
                    {Array.from({ length: layout.count }).map((_, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-pink-200/60 to-blue-200/60 rounded-sm group-hover:from-pink-300/60 group-hover:to-blue-300/60 transition-colors duration-300"
                      ></div>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-serif text-slate-700 mb-2">
                  {layout.name}
                </h3>
                <p className="text-slate-500 text-sm font-light mb-4">
                  {layout.description}
                </p>
                <div className="text-xs text-slate-400 bg-slate-100/50 px-3 py-1 rounded-full inline-block">
                  {layout.count} photos
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-slate-400 text-sm font-light italic">
          Each layout creates a unique photobooth strip experience
        </p>
      </div>
    </div>
  );
};

export default LayoutSelection;