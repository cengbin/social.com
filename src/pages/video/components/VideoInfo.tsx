import React from 'react';
import './VideoInfo.scss';
import { VideoInfoProps } from '../types';

const VideoInfo: React.FC<VideoInfoProps> = ({
  title,
  uploader,
  views,
  likes,
  date,
}) => {
  return (
    <div className="video-info-container">
      <h1 className="video-title">{title}</h1>
      <div className="video-stats">
        <div className="uploader-info">
          <div className="uploader-avatar">
            <img src="https://placeholder.co/40" alt={uploader} />
          </div>
          <div className="uploader-details">
            <div className="uploader-name">{uploader}</div>
            <div className="uploader-followers">100.0万粉丝</div>
          </div>
          <button className="follow-btn">关注</button>
        </div>
        <div className="video-actions">
          <div className="action-stats">
            <span className="views">{views}观看</span>
            <span className="date">{date}</span>
          </div>
          <div className="action-buttons">
            <button className="action-btn like">
              <span className="icon">👍</span>
              <span>{likes}</span>
            </button>
            <button className="action-btn collect">
              <span className="icon">⭐</span>
              <span>收藏</span>
            </button>
            <button className="action-btn share">
              <span className="icon">↗️</span>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
      <div className="video-description">
        <h3>视频简介</h3>
        <p>这是一个示例视频描述，描述视频的主要内容和亮点。在这里可以添加更多的详细信息，包括视频标签、相关链接等。</p>
      </div>
    </div>
  );
};

export default VideoInfo;
