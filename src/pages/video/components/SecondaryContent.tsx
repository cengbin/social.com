import React, { useEffect, useState } from 'react';
import './SecondaryContent.scss';
import { SM } from "../../../services";
import { Video, SecondaryContentProps, VideoFirstFrameData } from '../types';

// 将秒数转换为时分秒格式
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// 从URL中提取文件名（不含后缀）
const getFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // 获取路径最后一部分作为文件名
    const fileName = pathname.split('/').pop() || '';
    // 解码URL编码的字符并移除文件扩展名
    const decodedName = decodeURIComponent(fileName);
    return decodedName.replace(/\.[^/.]+$/, ''); // 移除最后的文件扩展名
  } catch (e) {
    // 如果URL解析失败，尝试直接从字符串中提取
    const parts = url.split('/');
    const fileName = parts[parts.length - 1];
    return decodeURIComponent(fileName).replace(/\.[^/.]+$/, ''); // 移除最后的文件扩展名
  }
};

// 获取视频第一帧的工具函数
const getVideoFirstFrame = (videoUrl: string): Promise<VideoFirstFrameData> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    let frameData: any = null;
    let duration: any = null;
    const fileName = getFileNameFromUrl(videoUrl);
    console.log({fileName});

    function callback() {
      if (frameData && duration) {
        resolve({
          frameData,
          duration: formatDuration(duration),
          videoName: fileName
        });
      }
    }

    // 设置视频属性
    video.crossOrigin = 'anonymous';
    video.autoplay = false;
    video.muted = true;
    video.currentTime = 1; // 设置到1秒位置，避免黑屏

    // 获取视频时长的处理函数
    video.onloadedmetadata = () => {
      duration = video.duration;
      callback()
    };

    // 当视频可以播放时进行截图
    video.oncanplay = () => {
      try {
        // 设置canvas尺寸与视频相同
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // 绘制当前帧
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 转换为base64图片格式
        const dataUrl = canvas.toDataURL('image/jpeg');
        frameData = dataUrl;

        callback()

        // 清理资源
        video.remove();
      } catch (error) {
        reject(error);
      }
    };

    // 视频加载错误处理
    video.onerror = (error) => {
      reject(error);
      video.remove();
    };

    // 设置视频源并开始加载
    video.src = videoUrl;
    video.load();
  });
};


interface SecondaryContentProps {
  currentVideoId: number;
  onVideoSelect: (videoId: number) => void;
}

const SecondaryContent: React.FC<SecondaryContentProps> = ({
  currentVideoId,
  onVideoSelect
}) => {
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);

  useEffect(() => {
    // 获取推荐视频列表
    SM.getRecommendVideoList({}).then(async (result) => {
      for (let i = 0; i < result.data.length; i++) {
        const {frameData, duration, videoName} = await getVideoFirstFrame(result.data[i]['videoUrl']);
        result.data[i].frameData = frameData;
        result.data[i].duration = duration;
        result.data[i].videoName = videoName;
      }

      // 转换API返回的数据为组件所需格式
      const formattedVideos = result.data
      setRecommendedVideos(formattedVideos);
    }).catch(error => {
      console.error('Failed to fetch recommended videos:', error);
    });
  }, []);


  return (
    <div className="secondary-content">
      <div className="recommended-videos">
        <div className="section-header">
          <h3>相关推荐</h3>
        </div>
        <div className="video-list">
          {recommendedVideos.map((video) => (
            <div
              key={video.id}
              className={`video-item ${video.id === Number(currentVideoId) ? 'active' : ''}`}
              onClick={() => {
                onVideoSelect(video.id);
                // 更新URL参数并刷新页面
                const newUrl = `/video.html?id=${video.id}&url=${encodeURIComponent(video.videoUrl || '')}`;
                window.location.href = newUrl;
              }}
            >
              <div className="video-cover">
                <img 
                  src={video.frameData}
                  alt={video.videoName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/default-thumbnail.jpg';
                  }}
                />
                <span className="duration">{video.duration}</span>
              </div>
              <div className="video-info">
                <h4 className="video-title">{video.videoName}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondaryContent;
