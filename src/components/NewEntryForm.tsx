"use client";

import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import MediaCarousel from './MediaCarousel';

interface NewEntryFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function NewEntryForm({ onClose, onSuccess }: NewEntryFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.svg'],
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'],
      'audio/*': ['.mp3', '.wav', '.aac', '.ogg', '.wma', '.flac', '.m4a'],
    },
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Use useRef to track submission status
  const submissionRef = useRef(false);
  const submissionInProgress = useCallback(() => {
    return isSubmitting || submissionRef.current;
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enhanced validation
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    // Prevent double submission
    if (submissionInProgress()) {
      console.log('Submission already in progress, preventing duplicate');
      return;
    }
    
    // Disable the form immediately
    setIsSubmitting(true);
    submissionRef.current = true;
    
    // Generate a unique submission ID to prevent duplicates
    const submissionId = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('submissionId', submissionId); // Add submission ID to detect duplicates
      
      files.forEach(file => {
        formData.append('files', file);
      });

      // Add a timeout to prevent hanging submissions
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/entries', {
        method: 'POST',
        body: formData,
        signal: controller.signal,
        // Prevent browser caching
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        console.log('Entry created successfully:', result);
        
        // Small delay to ensure UI updates properly
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 300);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create entry');
      }
    } catch (error) {
      console.error('Error creating entry:', error);
      
      // More user-friendly error message
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Request timed out. Please try again.');
      } else {
        alert(`Failed to create entry: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsSubmitting(false);
      submissionRef.current = false;
    }
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.startsWith('video/')) return '🎥';
    if (file.type.startsWith('audio/')) return '🎵';
    return '📄';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#EBEDE8]">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C]">
              Create New Entry
            </h2>
            <button
              onClick={onClose}
              className="text-[#333F3C] hover:text-[#004838] text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-[#333F3C] mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-[#EBEDE8] rounded-lg focus:ring-2 focus:ring-[#E2FB6C] focus:border-[#004838] transition-colors"
              placeholder="Enter a title for your memory..."
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-[#333F3C] mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-[#EBEDE8] rounded-lg focus:ring-2 focus:ring-[#E2FB6C] focus:border-[#004838] transition-colors resize-none"
              placeholder="Tell your story..."
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-[#333F3C] mb-2">
              Media Files
            </label>
            <div
            {...getRootProps({
                className: `border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                            isDragActive
                            ? 'border-[#004838] bg-[#E2FB6C] bg-opacity-10'
                            : 'border-[#EBEDE8] hover:border-[#E2FB6C]'
                }`
            })}
            >
              <input {...getInputProps()} />
              <div className="text-4xl mb-4">📁</div>
              {isDragActive ? (
                <p className="text-[#004838] font-medium">Drop files here...</p>
              ) : (
                <div>
                  <p className="text-[#333F3C] font-medium mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-[#333F3C] opacity-75">
                    Supports images, videos, and audio files
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* File Preview */}
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#333F3C] mb-3">
                Selected Files ({files.length})
              </h3>
              {files.length > 3 ? (
                <MediaCarousel>
                  {files.map((file, index) => (
                    <FilePreviewCard 
                      key={index}
                      file={file} 
                      index={index} 
                      onRemove={removeFile}
                      getFilePreview={getFilePreview}
                      getFileIcon={getFileIcon}
                    />
                  ))}
                </MediaCarousel>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {files.map((file, index) => (
                    <FilePreviewCard 
                      key={index}
                      file={file} 
                      index={index} 
                      onRemove={removeFile}
                      getFilePreview={getFilePreview}
                      getFileIcon={getFileIcon}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-[#EBEDE8] text-[#333F3C] rounded-lg font-medium hover:bg-[#EBEDE8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 gradient-cta text-[#E2FB6C] px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface FilePreviewCardProps {
  file: File;
  index: number;
  onRemove: (index: number) => void;
  getFilePreview: (file: File) => string | null;
  getFileIcon: (file: File) => string;
}

function FilePreviewCard({ file, index, onRemove, getFilePreview, getFileIcon }: FilePreviewCardProps) {
  const preview = getFilePreview(file);
  
  return (
    <div className="relative bg-[#EBEDE8] rounded-lg p-4">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors"
      >
        ×
      </button>
      
      {preview ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt={file.name}
            className="w-full h-32 object-cover rounded-lg mb-2"
          />
        </>
      ) : (
        <div className="w-full h-32 flex items-center justify-center text-4xl rounded-lg mb-2">
          {getFileIcon(file)}
        </div>
      )}
      
      <p className="text-sm font-medium text-[#333F3C] truncate">
        {file.name}
      </p>
      <p className="text-xs text-[#333F3C] opacity-75">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  );
}