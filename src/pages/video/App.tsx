import React, {useEffect, useState} from 'react'
import './App.css'
import Header from '../../components/Header.tsx'
import VideoPlayer from './components/VideoPlayer.tsx'
import VideoInfo from './components/VideoInfo.tsx'

function App() {
    const [videoId, setVideoId] = useState<string>('')
    const [videoUrl, setVideoUrl] = useState<string>('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const videoId = params.get('id') || '1'
        const videoUrl = params.get('url') || '/video/movie.mp4'
        setVideoId(videoId)
        setVideoUrl(videoUrl)
    }, [])

    // 模拟视频数据
    const videoData = {
        title: '示例视频标题 - 这是一个精彩的视频',
        uploader: 'UP主名称',
        views: '10.5万',
        likes: '1.2万',
        date: '2024-02-21',
    }

    return (
        <div className="app">
            <Header/>
            <main className="main-content">
                <div className="video-container">
                    <div className="primary-content">
                        <VideoPlayer videoId={videoId} videoUrl={videoUrl}/>
                        <VideoInfo {...videoData} />
                    </div>
                    <div className="secondary-content">
                        {/* 这里可以添加推荐视频列表等其他内容 */}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
