"use client";

import { useState, useEffect } from 'react';
import MediaCarousel from './MediaCarousel';

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

interface Entry {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  media: MediaItem[];
}

interface TimelineProps {
  onClose: () => void;
}

export default function Timeline({ onClose }: TimelineProps) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMediaIcon = (fileType: string) => {
    switch (fileType) {
      case 'image': return '🖼️';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      default: return '📄';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004838] mx-auto mb-4"></div>
          <p className="text-[#333F3C] font-medium">Loading your memories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#EBEDE8]">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
              Your Memory Timeline
            </h2>
            <button
              onClick={onClose}
              className="text-[#333F3C] hover:text-[#004838] text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {entries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-2">
                No memories yet
              </h3>
              <p className="text-[#333F3C] opacity-75">
                Start creating your first entry to see your timeline here.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {entries.map((entry, index) => (
                <div key={entry.id} className="relative">
                  {/* Timeline line */}
                  {index !== entries.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-full bg-[#EBEDE8]"></div>
                  )}
                  
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-4 w-4 h-4 bg-[#004838] rounded-full border-4 border-white shadow-sm"></div>
                  
                  {/* Entry content */}
                  <div className="ml-12 bg-white border border-[#EBEDE8] rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-1">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-[#333F3C] opacity-75">
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                      {entry.media.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-[#333F3C] opacity-75">
                          <span>{entry.media.length}</span>
                          <span>📎</span>
                        </div>
                      )}
                    </div>

                    {entry.description && (
                      <p className="text-[#333F3C] mb-4 leading-relaxed">
                        {entry.description}
                      </p>
                    )}

                    {/* Media Gallery */}
                    {entry.media.length > 0 && (
                      <div className="mt-4">
                        {entry.media.length > 3 ? (
                          <MediaCarousel>
                            {entry.media.map((mediaItem) => (
                              <MediaItem key={mediaItem.id} media={mediaItem} />
                            ))}
                          </MediaCarousel>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {entry.media.map((mediaItem) => (
                              <MediaItem key={mediaItem.id} media={mediaItem} />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MediaItemProps {
  media: MediaItem;
}

function MediaItem({ media }: MediaItemProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMediaClick = () => {
    if (media.fileType === 'image') {
      setIsFullscreen(true);
    }
  };

  return (
    <>
      <div 
        className="relative bg-[#EBEDE8] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={handleMediaClick}
      >
        {media.fileType === 'image' && (
          <img
            src={media.publicUrl}
            alt={media.originalName}
            className="w-full h-48 object-cover"
          />
        )}
        
        {media.fileType === 'video' && (
          <div className="relative">
            <video
              src={media.publicUrl}
              className="w-full h-48 object-cover"
              controls
              preload="metadata"
            />
          </div>
        )}
        
        {media.fileType === 'audio' && (
          <div className="p-6 text-center">
            <div className="text-4xl mb-4">🎵</div>
            <audio
              src={media.publicUrl}
              controls
              className="w-full"
            />
            <p className="text-sm font-medium text-[#333F3C] mt-2 truncate">
              {media.originalName}
            </p>
          </div>
        )}

        {media.fileType === 'other' && (
          <div className="p-6 text-center">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-sm font-medium text-[#333F3C] truncate">
              {media.originalName}
            </p>
            <a
              href={media.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#004838] hover:underline mt-2 inline-block"
            >
              Download
            </a>
          </div>
        )}

        {/* File info overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
          <p className="text-xs truncate">{media.originalName}</p>
        </div>
      </div>

      {/* Fullscreen modal for images */}
      {isFullscreen && media.fileType === 'image' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <img
            src={media.publicUrl}
            alt={media.originalName}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white text-3xl hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}