import {Get} from '../decorator/http';

export class SM {
    @Get({url: '/mock/all_video_list.json'})
    static async getFiles(params: any = {}) {
        return params;
    }

    @Get({url: '/mock/home_video_list.json'})
    static async getHomeVideoList(params: any = {}) {
        return params;
    }

    @Get({url: '/mock/recommend_video_list.json'})
    static async getRecommendVideoList(params: any = {}) {
        return params;
    }
}
