import {Get} from '../decorator/http';

export class SM {

    @Get({url: '/mock/all_video_list.json'})
    static async getAllVideoList(params: any = {}) {
        return params;
    }

    @Get({url: '/mock/video_info.json'})
    static async getVideoDetail(params: any = {}) {
        return params;
    }

    @Get({url: '/mock/recommend_video_list.json'})
    static async getRecommendVideoList(params: any = {}) {
        return params;
    }
}
