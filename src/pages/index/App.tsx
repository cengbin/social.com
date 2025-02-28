import React, {useEffect, useState} from 'react'
import './App.scss'
import Header from '../../components/Header.tsx'
import VideoGrid from './components/VideoGrid.tsx'
import {SM} from '../../services'
import {Video, VideoGroups} from "./types.ts";
import {getVideoFirstFrame} from "../../utils";

function App() {
    const [videoList, setVideoList] = useState<Video[]>([]);
    const [videoGroups, setVideoGroups] = useState<VideoGroups[]>(null);

    useEffect(() => {
        SM.getFiles().then(async result => {
            const videoGroupList = result.children;
            const group = []
            for (let i = 0; i < videoGroupList.length; i++) {
                const videoGroup = videoGroupList[i];
                const videoList: any = [];

                const includes = [
                    '128-视觉笔记入门课',
                    '161-手机摄影',
                    '168-大厂晋升指南',
                    '182-MySQL 必知必会',
                    // '[何雄] 极端·逆像——“鸟人”何雄手机摄影分享'
                ];

                function dfs(item: any) {
                    item?.children && item?.children.forEach((child: any) => {
                        if (child.extension === "mp4") {
                            const url = child.path.replaceAll("\\", "/").replace("F:/BaiduNetdiskDownload/", "http://static.miimo.com:5000/");
                            videoList.push({
                                name: child.name,
                                url,
                            })
                        }
                        dfs(child)
                    });
                }

                if (includes.includes(videoGroup.name)) {
                    dfs(videoGroup)
                }

                for (let i = 0; i < videoList.length; i++) {
                    const {frameData, duration, videoName} = await getVideoFirstFrame(videoList[i].url);
                    videoList[i].frameData = frameData;
                    videoList[i].duration = duration;
                    videoList[i].name = videoName;
                }

                group.push({
                    name: videoGroup.name,
                    videoList,
                })
            }
            console.log({group})
            setVideoGroups(group);
        })

        SM.getHomeVideoList({}).then(async result => {
            for (let i = 0; i < result.data.length; i++) {
                const {frameData, duration, videoName} = await getVideoFirstFrame(result.data[i]['videoUrl']);
                result.data[i].frameData = frameData;
                result.data[i].duration = duration;
                result.data[i].name = videoName;
            }
            setVideoList(result.data || []);
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
                                <h2 className="category-title">【{index + 1}】{group.name}</h2>
                                {
                                    (group.videoList && group.videoList.length)
                                        ? (<VideoGrid videoList={group.videoList}/>)
                                        : null
                                }
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    )
}

export default App
