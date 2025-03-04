import React, { useRef, useState, useEffect, useCallback } from 'react';
import './VideoPlayer.scss';
import { VideoPlayerProps } from '../types';

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(100);
  const [prevVolume, setPrevVolume] = useState(100);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isSpeedMenuVisible, setIsSpeedMenuVisible] = useState(false);
  const [speedMenuTimer, setSpeedMenuTimer] = useState<NodeJS.Timeout | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWebFullscreen, setIsWebFullscreen] = useState(false);
  const [isShortcutsVisible, setIsShortcutsVisible] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  const shortcuts = [
    { key: 'Space / K', description: '播放/暂停' },
    { key: '←', description: '后退 5 秒' },
    { key: '→', description: '前进 5 秒' },
    { key: '↑', description: '增加音量' },
    { key: '↓', description: '减少音量' },
    { key: 'M', description: '静音/取消静音' },
    { key: 'F', description: '全屏' },
    { key: 'W', description: '网页全屏' },
    { key: '1-5', description: '设置播放速度 (1x - 2x)' }
  ];

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (videoRef.current) {
      if (!isMuted) {
        setPrevVolume(volume);
        setVolume(0);
        videoRef.current.volume = 0;
        videoRef.current.muted = true;
      } else {
        const volumeToRestore = prevVolume || 100;
        setVolume(volumeToRestore);
        videoRef.current.volume = volumeToRestore / 100;
        videoRef.current.muted = false;
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted, volume, prevVolume]);

  const handleSpeedChange = useCallback((speed: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setIsSpeedMenuVisible(false);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).msRequestFullscreen) {
          await (containerRef.current as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [isFullscreen]);

  const toggleWebFullscreen = useCallback(() => {
    setIsWebFullscreen(!isWebFullscreen);
  }, [isWebFullscreen]);

  const toggleShortcuts = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShortcutsVisible(!isShortcutsVisible);
  }, [isShortcutsVisible]);

  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(formatTime(videoRef.current.currentTime));
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  }, [formatTime]);

  const handleProgress = useCallback(() => {
    if (videoRef.current) {
      const bufferedRanges = videoRef.current.buffered;
      if (bufferedRanges.length > 0) {
        const bufferedEnd = bufferedRanges.end(bufferedRanges.length - 1);
        const bufferedPercent = (bufferedEnd / videoRef.current.duration) * 100;
        setBuffered(bufferedPercent);
      }
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(formatTime(videoRef.current.duration));
    }
  }, [formatTime]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (progressRef.current && videoRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const progressWidth = rect.width;
      const percentage = (clickPosition / progressWidth);
      const newTime = videoRef.current.duration * percentage;
      
      videoRef.current.currentTime = newTime;
      setProgress(percentage * 100);
    }
  }, []);

  const handleVolumeContainerClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const getVolumeIcon = useCallback(() => {
    if (volume === 0 || isMuted) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  }, [volume, isMuted]);

  const handleSpeedMenuEnter = useCallback(() => {
    if (speedMenuTimer) {
      clearTimeout(speedMenuTimer);
      setSpeedMenuTimer(null);
    }
    setIsSpeedMenuVisible(true);
  }, [speedMenuTimer]);

  const handleSpeedMenuLeave = useCallback(() => {
    const timer = setTimeout(() => {
      setIsSpeedMenuVisible(false);
    }, 100);
    setSpeedMenuTimer(timer);
  }, []);

  const handleVideoEnded = useCallback(() => {
    setIsPlaying(false);
    setIsEnded(true);
  }, []);

  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
      setIsEnded(false);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('ended', handleVideoEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('ended', handleVideoEnded);
    };
  }, []);

  useEffect(() => {
    // 恢复上次保存的音量
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume !== null) {
      const vol = parseInt(savedVolume);
      setVolume(vol);
      if (videoRef.current) {
        videoRef.current.volume = vol / 100;
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // 如果正在输入，不处理快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case ' ':  // 空格键
        case 'k':  // B站/YouTube风格的播放/暂停
          e.preventDefault();
          togglePlay();
          break;
        case 'f':  // 全屏
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'w':  // 网页全屏
          e.preventDefault();
          toggleWebFullscreen();
          break;
        case 'm':  // 静音
          e.preventDefault();
          toggleMute(e as any);
          break;
        case 'arrowup':  // 音量增加
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.min(volume + 5, 100);
            setVolume(newVolume);
            videoRef.current.volume = newVolume / 100;
            setIsMuted(false);
          }
          break;
        case 'arrowdown':  // 音量减少
          e.preventDefault();
          if (videoRef.current) {
            const newVolume = Math.max(volume - 5, 0);
            setVolume(newVolume);
            videoRef.current.volume = newVolume / 100;
            setIsMuted(newVolume === 0);
          }
          break;
        case 'arrowright':  // 快进5秒
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime += 5;
          }
          break;
        case 'arrowleft':  // 后退5秒
          e.preventDefault();
          if (videoRef.current) {
            videoRef.current.currentTime -= 5;
          }
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5': {
          // 1-5对应不同的播放速度
          e.preventDefault();
          const speedMap: { [key: string]: number } = {
            '1': 1,
            '2': 1.25,
            '3': 1.5,
            '4': 1.75,
            '5': 2
          };
          handleSpeedChange(speedMap[e.key], e as any);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [volume, togglePlay, toggleFullscreen, toggleWebFullscreen, toggleMute, handleSpeedChange]);

  const speeds = [2, 1.75, 1.5, 1.25, 1];

  return (
    <div 
      className={`video-player-container ${isWebFullscreen ? 'web-fullscreen' : ''}`} 
      ref={containerRef}
    >
      <div className="video-player">
        <video
          ref={videoRef}
          src={videoUrl}
          className="video-element"
          onClick={togglePlay}
        />
        {isEnded && (
          <div className="replay-overlay" onClick={handleReplay}>
            <div className="replay-button">
              <svg viewBox="0 0 24 24" width="48" height="48">
                <path fill="currentColor" d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
              </svg>
              <span>重新播放</span>
            </div>
          </div>
        )}
      </div>
      <div className="video-controls">
        <div className="progress-bar" ref={progressRef} onClick={handleProgressClick}>
          <div className="progress-buffered" style={{ width: `${buffered}%` }} />
          <div className="progress-filled" style={{ width: `${progress}%` }} />
        </div>
        <div className="controls-bottom">
          <div className="control-left">
            <button className="control-btn play" onClick={togglePlay}>
              {isPlaying ? '暂停' : '播放'}
            </button>
            <span className="time-display">{currentTime} / {duration}</span>
          </div>
          <div className="control-right">
            <div className="shortcuts-control">
              <button className="control-btn" onClick={toggleShortcuts}>
                ⌨️
              </button>
              {isShortcutsVisible && (
                  <div className="shortcuts-menu visible">
                    <div className="shortcuts-header">
                      <h3>快捷键</h3>
                      <button className="close-btn" onClick={toggleShortcuts}>×</button>
                    </div>
                    <div className="shortcuts-content">
                      {shortcuts.map((shortcut, index) => (
                          <div key={index} className="shortcut-item">
                            <kbd>{shortcut.key}</kbd>
                            <span>{shortcut.description}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}
            </div>
            <div
                className="volume-control"
                onMouseEnter={() => setIsVolumeVisible(true)}
                onMouseLeave={() => setIsVolumeVisible(false)}
            >
              <button className="control-btn volume" onClick={toggleMute}>
                {getVolumeIcon()}
              </button>
              <div
                  className={`volume-slider-container ${isVolumeVisible ? 'visible' : ''}`}
                  onClick={handleVolumeContainerClick}
              >
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    className="volume-slider"
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            <div className="speed-control"
                 onMouseEnter={handleSpeedMenuEnter}
                 onMouseLeave={handleSpeedMenuLeave}
            >
              <button
                  className="control-btn speed"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSpeedMenuVisible(!isSpeedMenuVisible);
                  }}
              >
                倍速
              </button>
              <div
                  className={`speed-menu ${isSpeedMenuVisible ? 'visible' : ''}`}
                  onMouseEnter={handleSpeedMenuEnter}
                  onMouseLeave={handleSpeedMenuLeave}
                  onClick={(e) => e.stopPropagation()}
              >
                {speeds.map(speed => (
                    <button
                        key={speed}
                        className={`speed-item ${speed === playbackSpeed ? 'active' : ''}`}
                        onClick={(e) => handleSpeedChange(speed, e)}
                    >
                      {speed}x
                    </button>
                ))}
              </div>
            </div>
            <button
                className="control-btn web-fullscreen"
                onClick={toggleWebFullscreen}
            >
              {isWebFullscreen ? '退出网页全屏' : '网页全屏'}
            </button>
            <button
                className="control-btn fullscreen"
                onClick={toggleFullscreen}
            >
              {isFullscreen ? '退出全屏' : '全屏'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
