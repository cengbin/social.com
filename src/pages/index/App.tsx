import React, { useEffect, useState } from 'react'
import './App.css'
import Header from '../../components/Header.tsx'
import VideoGrid from './components/VideoGrid.tsx'
import { SM } from '../../services'

interface VideoItem {
  id: string;
  title: string;
  cover: string;
  category: string;
  createTime: string;
}

interface GroupedVideos {
  [category: string]: VideoItem[];
}

function App() {
  const [groupedVideos, setGroupedVideos] = useState<GroupedVideos>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const result = await SM.getAllVideoList();
        setGroupedVideos(result.data);
      } catch (error) {
        console.error('获取视频列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <VideoGrid />
        {/*{loading ? (
          <div className="loading">加载中...</div>
        ) : (
          <div className="video-categories">
            {Object.entries(groupedVideos).map(([category, videos]) => (
              <div key={category} className="category-section">
                <h2 className="category-title">{category}</h2>
                <VideoGrid videos={videos} />
              </div>
            ))}
          </div>
        )}*/}
      </main>
    </div>
  )
}

export default App
