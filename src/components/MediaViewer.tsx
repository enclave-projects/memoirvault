"use client";

import { useState, useEffect } from 'react';

interface MediaItem {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  publicUrl: string;
  createdAt: string;
}

interface MediaViewerProps {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function MediaViewer({ media, initialIndex, onClose }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentMedia = media[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsZoomed(false);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < media.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsZoomed(false);
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, media.length, onClose]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Modern Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal Container */}
      <div className="relative bg-black/90 backdrop-blur-xl rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-6 text-white border-b border-white/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                {currentMedia.fileType === 'image' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
                {currentMedia.fileType === 'video' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
                {currentMedia.fileType === 'audio' && (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="font-bold text-xl">{currentMedia.originalName}</h2>
                <div className="flex items-center gap-4 text-white/70 text-sm mt-1">
                  <span>{formatFileSize(currentMedia.fileSize)}</span>
                  <span>•</span>
                  <span>{formatDate(currentMedia.createdAt)}</span>
                  <span>•</span>
                  <span>{currentIndex + 1} of {media.length}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Navigation Buttons */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(currentIndex - 1);
                        setIsZoomed(false);
                      }
                    }}
                    disabled={currentIndex === 0}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    title="Previous"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => {
                      if (currentIndex < media.length - 1) {
                        setCurrentIndex(currentIndex + 1);
                        setIsZoomed(false);
                      }
                    }}
                    disabled={currentIndex === media.length - 1}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                    title="Next"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
              
              {/* Zoom Button for Images */}
              {currentMedia.fileType === 'image' && (
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                  title={isZoomed ? "Zoom Out" : "Zoom In"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isZoomed ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10h-3m-3 0h3m0 0V7m0 3v3" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    )}
                  </svg>
                </button>
              )}
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-all duration-200 backdrop-blur-sm"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden bg-black flex items-center justify-center" style={{ height: 'calc(90vh - 120px)' }}>
          {currentMedia.fileType === 'image' && (
            <div className={`relative w-full h-full flex items-center justify-center ${isZoomed ? 'overflow-auto' : 'overflow-hidden'}`}>
              <img
                src={currentMedia.publicUrl}
                alt={currentMedia.originalName}
                className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
                  isZoomed ? 'scale-150 cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                }`}
                onClick={() => !isZoomed && setIsZoomed(true)}
                draggable={false}
              />
            </div>
          )}

          {currentMedia.fileType === 'video' && (
            <div className="w-full h-full flex items-center justify-center">
              <video
                src={currentMedia.publicUrl}
                controls
                autoPlay
                className="max-w-full max-h-full"
                style={{ maxHeight: 'calc(90vh - 120px)' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {currentMedia.fileType === 'audio' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-12">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              
              <h3 className="text-white text-2xl font-bold mb-4 text-center">{currentMedia.originalName}</h3>
              
              <audio
                src={currentMedia.publicUrl}
                controls
                autoPlay
                className="w-full max-w-md"
                style={{
                  filter: 'invert(1) hue-rotate(180deg)',
                  borderRadius: '12px'
                }}
              >
                Your browser does not support the audio tag.
              </audio>
              
              <div className="mt-6 text-white/70 text-center">
                <p className="text-sm">File size: {formatFileSize(currentMedia.fileSize)}</p>
                <p className="text-sm">Uploaded: {formatDate(currentMedia.createdAt)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation for Multiple Files */}
        {media.length > 1 && (
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4 border-t border-white/10">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsZoomed(false);
                  }}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    index === currentIndex 
                      ? 'border-white shadow-lg scale-110' 
                      : 'border-white/20 hover:border-white/50'
                  }`}
                >
                  {item.fileType === 'image' && (
                    <img
                      src={item.publicUrl}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {item.fileType === 'video' && (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-9-4h10a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                      </svg>
                    </div>
                  )}
                  {item.fileType === 'audio' && (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}