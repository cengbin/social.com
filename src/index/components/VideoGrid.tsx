import React, {useEffect, useState} from 'react';
import './VideoGrid.css';
import {SM} from "../../services";

interface Video {
    id: number;
    title: string;
    cover: string;
    uploader: string;
    views: string;
    duration: string;
}

const VideoGrid: React.FC = () => {
    const [videoList, setVideoList] = useState<Video[]>([]);

    useEffect(() => {
        SM.getVideoList({}).then(result => {
            setVideoList(result.data || []);
        })
    }, [])

    return (
        <div className="video-grid">
            {videoList.map(video => (
                <a
                    key={video.id}
                    href={`/video.html?id=${video.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card"
                >
                    <div className="video-cover">
                        <img src={video.cover} alt={video.title}/>
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
