import React from 'react';
import './VideoGrid.css';

export default ({videoList}) => {
    return (
        <div className="video-grid">
            {videoList.map(video => (
                <a
                    key={video.id}
                    href={`/video.html?id=${video.id}&url=${encodeURIComponent(video.url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="video-card"
                >
                    {video.frameData && (<div className="video-cover">
                        <img src={video.frameData} alt={video.name}/>
                        <span className="duration">{video.duration}</span>
                    </div>)}

                    <div className="video-info">
                        <h3 className="video-title">{video.name}</h3>
                    </div>
                </a>
            ))}
        </div>
    );
};