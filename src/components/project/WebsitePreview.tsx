
import React, { useState, useEffect } from 'react';

export interface WebsitePreviewData {
  title: string;
  description: string;
  image: string;
  favicon: string;
  loading: boolean;
  error: boolean;
}

interface WebsitePreviewProps {
  url: string;
  projectName: string;
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ url, projectName }) => {
  const [previewData, setPreviewData] = useState<WebsitePreviewData>({
    title: '',
    description: '',
    image: '',
    favicon: '',
    loading: true,
    error: false
  });

  useEffect(() => {
    // Only attempt to fetch if we have a valid URL
    if (url && url.trim() !== '') {
      fetchWebsitePreview(url);
    } else {
      setPreviewData(prev => ({ 
        ...prev, 
        loading: false, 
        error: true 
      }));
    }
  }, [url]);

  const fetchWebsitePreview = async (url: string) => {
    try {
      setPreviewData(prev => ({ ...prev, loading: true, error: false }));
      
      // Use a free preview API (replace with your preferred service or API key)
      // const apiUrl = `https://api.linkpreview.net/?key=123456789&q=${encodeURIComponent(url)}`;
      
      // For demo purposes, we'll simulate the API response
      // In production, you would make a real fetch call to the API
      setTimeout(() => {
        const mockData = {
          title: projectName + ' - Website',
          description: 'Description of ' + projectName + ' website',
          image: 'https://via.placeholder.com/300x150?text=' + encodeURIComponent(projectName),
          favicon: 'https://www.google.com/s2/favicons?domain=' + encodeURIComponent(url)
        };
        
        setPreviewData({
          ...mockData,
          loading: false,
          error: false
        });
      }, 500);
      
      // Uncomment below for actual API implementation
      /*
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch preview');
      
      const data = await response.json();
      setPreviewData({
        title: data.title || '',
        description: data.description || '',
        image: data.image || '',
        favicon: data.favicon || `https://www.google.com/s2/favicons?domain=${url}`,
        loading: false,
        error: false
      });
      */
    } catch (error) {
      console.error('Error fetching website preview:', error);
      setPreviewData(prev => ({ 
        ...prev, 
        loading: false, 
        error: true 
      }));
    }
  };

  // Don't render anything if no URL
  if (!url || url.trim() === '') {
    return null;
  }

  if (previewData.loading) {
    return (
      <div className="mt-4 rounded-md overflow-hidden border">
        <div className="h-20 bg-muted/50 animate-pulse flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Loading preview...</span>
        </div>
      </div>
    );
  }

  if (previewData.error) {
    return (
      <div className="mt-4 rounded-md overflow-hidden border">
        <div className="h-20 bg-muted/50 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">Preview unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-md overflow-hidden border">
      <div className="flex p-2 bg-card">
        {previewData.favicon && (
          <img 
            src={previewData.favicon} 
            alt="Site favicon" 
            className="h-6 w-6 mr-2 self-start mt-0.5"
            onError={(e) => {
              // Handle image loading error
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{previewData.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{previewData.description}</p>
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate block mt-1"
          >
            {url}
          </a>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview;
