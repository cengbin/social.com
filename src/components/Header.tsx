import React from 'react';
import './Header.css';

const Header: React.FC = () => {
    const isActive = (path: string) => {
        return window.location.pathname === path ? 'nav-item active' : 'nav-item';
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="header-left">
                    <div className="logo">LOGO</div>
                    <nav className="main-nav">
                        <a href="/" className={isActive('/')}>首页</a>
                        <a href="/video.html" className={isActive('/video.html')}>视频</a>
                        <a href="/live" className={isActive('/live')}>直播</a>
                        <a href="/game" className={isActive('/game')}>游戏</a>
                        <a href="/anime" className={isActive('/anime')}>番剧</a>
                    </nav>
                </div>
                <div className="header-right">
                    <div className="search-box">
                        <input type="text" placeholder="搜索视频、用户、频道..."/>
                        <button className="search-btn">搜索</button>
                    </div>
                    <div className="user-actions">
                        <button className="upload-btn">投稿</button>
                        <div className="user-avatar">
                            <img src="/image/default_avatar.jpg" alt="用户头像"/>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
