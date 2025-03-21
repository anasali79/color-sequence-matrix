
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

const TOTAL_BOXES = 9;

const ColorMatrix = () => {
  const [clickSequence, setClickSequence] = useState<number[]>([]);
  const [playbackMode, setPlaybackMode] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState(0);
  const [playbackComplete, setPlaybackComplete] = useState(false);

  // Handle click on a box
  const handleBoxClick = (index: number) => {
    if (playbackMode) return;
    
    // If box already clicked, do nothing
    if (clickSequence.includes(index)) return;
    
    const newSequence = [...clickSequence, index];
    setClickSequence(newSequence);
    
    // If this is the last box (all boxes clicked)
    if (newSequence.length === TOTAL_BOXES) {
      setPlaybackMode(true);
      setPlaybackIndex(0);
    }
  };

  // Reset the game
  const handleReset = () => {
    setClickSequence([]);
    setPlaybackMode(false);
    setPlaybackIndex(0);
    setPlaybackComplete(false);
  };

  // Playback animation
  useEffect(() => {
    if (!playbackMode) return;
    
    // If we've played back all clicks, finish
    if (playbackIndex >= clickSequence.length) {
      setPlaybackComplete(true);
      return;
    }
    
    // Delay between animations
    const timer = setTimeout(() => {
      setPlaybackIndex(prev => prev + 1);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [playbackMode, playbackIndex, clickSequence]);

  // Determine the class for a box
  const getBoxClass = useCallback((index: number) => {
    const isClicked = clickSequence.includes(index);
    
    if (!isClicked) return '';
    
    if (playbackMode) {
      const sequencePosition = clickSequence.indexOf(index);
      
      if (sequencePosition < playbackIndex) {
        return 'bg-orange-400 animate-color-sequence';
      }
      
      return 'bg-green-300 animate-color-transition';
    }
    
    return 'bg-green-300 animate-color-transition';
  }, [clickSequence, playbackMode, playbackIndex]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 matrix-container">
      <div className="text-center mb-10 animate-fade-in">
        <span className="bg-black/5 text-xs font-medium px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">INTERACTIVE MATRIX</span>
        <h1 className="text-4xl font-medium text-gray-800 mb-2">Color Sequence Matrix</h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Click on each box to change its color. When all boxes are clicked, watch the sequence replay in orange.
        </p>
      </div>

      <div className="relative bg-white/30 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animate-fade-in">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: TOTAL_BOXES }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "matrix-box",
                getBoxClass(index)
              )}
              onClick={() => handleBoxClick(index)}
            >
              {clickSequence.includes(index) && (
                <span className="text-gray-700 font-medium">
                  {clickSequence.indexOf(index) + 1}
                </span>
              )}
            </div>
          ))}
        </div>
        
        {playbackComplete && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-fade-in">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-medium text-gray-800 mb-3">Sequence Complete</h3>
              <p className="text-gray-500 mb-4">All boxes have been highlighted in order.</p>
              <button 
                onClick={handleReset}
                className="reset-button"
              >
                Reset Matrix
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex space-x-3 animate-fade-in">
        <button 
          onClick={handleReset}
          className="reset-button"
          disabled={clickSequence.length === 0}
        >
          Reset
        </button>
      </div>
      
      <div className="text-gray-400 text-sm mt-8 animate-fade-in">
        Boxes clicked: {clickSequence.length} / {TOTAL_BOXES}
      </div>
    </div>
  );
};

export default ColorMatrix;
