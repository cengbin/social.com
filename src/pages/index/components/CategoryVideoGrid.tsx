import React from 'react';
import './CategoryVideoGrid.css';

interface VideoItem {
  id: string;
  title: string;
  cover: string;
  category: string;
  createTime: string;
}

interface CategoryVideoGridProps {
  videos: VideoItem[];
}

const CategoryVideoGrid: React.FC<CategoryVideoGridProps> = ({ videos }) => {
  return (
    <div className="category-video-grid">
      {videos.map((video) => (
        <div key={video.id} className="category-video-card">
          <div className="category-video-cover">
            <img src={video.cover} alt={video.title} />
          </div>
          <div className="category-video-info">
            <h3 className="category-video-title">{video.title}</h3>
            <div className="category-video-meta">
              <span className="category-video-time">{video.createTime}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryVideoGrid;
