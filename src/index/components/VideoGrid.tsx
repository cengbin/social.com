import React from 'react';
import './VideoGrid.css';

interface Video {
  id: number;
  title: string;
  cover: string;
  uploader: string;
  views: string;
  duration: string;
}

const mockVideos: Video[] = Array(12).fill(null).map((_, index) => ({
  id: index + 1,
  title: `示例视频标题 ${index + 1} - 这是一个较长的标题用来测试多行效果`,
  cover: `https://placeholder.co/320x200`,
  uploader: `UP主${index + 1}`,
  views: `${Math.floor(Math.random() * 100)}万观看`,
  duration: '12:34',
}));

const VideoGrid: React.FC = () => {
  return (
    <div className="video-grid">
      {mockVideos.map(video => (
        <a 
          key={video.id} 
          href={`/video.html?id=${video.id}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="video-card"
        >
          <div className="video-cover">
            <img src={video.cover} alt={video.title} />
            <span className="duration">{video.duration}</span>
          </div>
          <div className="video-info">
            <h3 className="video-title">{video.title}</h3>
            <div className="video-meta">
              <span className="uploader">{video.uploader}</span>
              <span className="views">{video.views}</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
};

export default VideoGrid;
