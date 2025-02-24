import React, { useRef, useState } from 'react';
import './VideoPlayer.css';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string; 
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(formatTime(videoRef.current.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  };

  return (
    <div className="video-player-container">
      <div className="video-player">
        <video
          ref={videoRef}
          className="video-element"
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
      </div>
      <div className="video-controls">
        <div className="control-left">
          <button className="control-btn play" onClick={togglePlay}>
            {isPlaying ? '暂停' : '播放'}
          </button>
          <div className="volume-control">
            <button className="control-btn volume">音量</button>
          </div>
          <span className="time-display">{currentTime} / {duration}</span>
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
