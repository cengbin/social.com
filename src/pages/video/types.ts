// 视频信息接口
export interface Video {
  id: number;
  videoUrl?: string;
  videoName: string;
  duration: string;
  frameData?: string;
}

// 视频播放器组件属性
export interface VideoPlayerProps {
  videoId: number;
  videoUrl: string;
}

// 二级内容组件属性
export interface SecondaryContentProps {
  currentVideoId: number;
  onVideoSelect: (videoId: number) => void;
}

// 视频第一帧数据接口
export interface VideoFirstFrameData {
  frameData: string;
  duration: string;
  videoName: string;
}

// 视频信息组件属性
export interface VideoInfoProps {
  title: string;
  uploader: string;
  views: number;
  likes: number;
  date: string;
}