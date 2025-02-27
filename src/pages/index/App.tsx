import React, {useEffect, useState} from 'react'
import './App.scss'
import Header from '../../components/Header.tsx'
import VideoGrid from './components/VideoGrid.tsx'
import {SM} from '../../services'
import {Video, VideoGroups} from "./types.ts";

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
const getVideoFirstFrame = (videoUrl: string): Promise<{ frameData: string, duration: string, videoName: string }> => {
    console.log({videoUrl});
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        let frameData: any = null;
        let duration: any = null;
        const fileName = getFileNameFromUrl(videoUrl);

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

function App() {
    const [videoList, setVideoList] = useState<Video[]>([]);
    const [videoGroups, setVideoGroups] = useState<VideoGroups[]>(null);

    useEffect(() => {
        SM.getHomeVideoList({}).then(async result => {
            for (let i = 0; i < result.data.length; i++) {
                const {frameData, duration, videoName} = await getVideoFirstFrame(result.data[i]['videoUrl']);
                result.data[i].frameData = frameData;
                result.data[i].duration = duration;
                result.data[i].name = videoName;
            }
            setVideoList(result.data || []);
        })

        SM.getAllVideoList().then(async result => {
            const group = []
            for (let i = 0; i < result.data.length; i++) {
                const item = result.data[i];
                const videoList: any = [];
                item?.children?.forEach((child: any) => {
                    if (child.type === 'directory') {
                        child?.children?.forEach((child: any) => {
                            if (child.type === 'video') {
                                videoList.push({
                                    name: child.name,
                                    url: child.url,
                                });
                            }
                        })
                    } else if (child.type === 'video') {
                        videoList.push({
                            name: child.name,
                            url: child.url,
                        });
                    }
                })

                for (let i = 0; i < videoList.length; i++) {
                    const {frameData, duration, videoName} = await getVideoFirstFrame(videoList[i].url);
                    videoList[i].frameData = frameData;
                    videoList[i].duration = duration;
                    videoList[i].name = videoName;
                }

                group.push({
                    name: item.name,
                    videoList,
                })
            }

            console.log({group})

            setVideoGroups(group);
        })
    }, []);

    return (
        <div className="app">
            <Header/>
            <main className="main-content">
                <VideoGrid videoList={videoList}/>
                {videoGroups && (
                    <div className="video-categories">
                        {videoGroups.map((group, index) => (
                            <div key={index} className="category-section">
                                <h2 className="category-title">{group.name}</h2>
                                <VideoGrid videoList={group.videoList}/>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
