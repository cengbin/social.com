import React from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videoId: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId }) => {
  return (
    <div className="video-player-container">
      <div className="video-player">
        {/* 这里可以集成真实的视频播放器，目前用占位符 */}
        <div className="video-placeholder">
          <span>视频播放区域 - ID: {videoId}</span>
        </div>
      </div>
      <div className="video-controls">
        <div className="control-left">
          <button className="control-btn play">播放</button>
          <div className="volume-control">
            <button className="control-btn volume">音量</button>
          </div>
          <span className="time-display">00:00 / 12:34</span>
        </div>
        <div className="control-right">
          <button className="control-btn quality">1080P</button>
          <button className="control-btn speed">1.0x</button>
          <button className="control-btn fullscreen">全屏</button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
