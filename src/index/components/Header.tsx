import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">LOGO</div>
          <nav className="main-nav">
            <a href="/" className="nav-item active">首页</a>
            <a href="/video" className="nav-item">视频</a>
            <a href="#" className="nav-item">直播</a>
            <a href="#" className="nav-item">游戏</a>
            <a href="#" className="nav-item">番剧</a>
          </nav>
        </div>
        <div className="header-right">
          <div className="search-box">
            <input type="text" placeholder="搜索视频、用户、频道..." />
            <button className="search-btn">搜索</button>
          </div>
          <div className="user-actions">
            <button className="upload-btn">投稿</button>
            <div className="user-avatar">
              <img src="https://placeholder.co/32" alt="用户头像" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
