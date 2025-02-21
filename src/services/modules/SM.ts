import {Get} from '../decorator/http';

export class SM {

    @Get({url: '/mock/video_list.json'})
    static async getVideoList(params: any = {}) {
        return params;
    }

    @Get({url: '/mock/video_info.json'})
    static async getVideoDetail(params: any = {}) {
        return params;
    }
}
