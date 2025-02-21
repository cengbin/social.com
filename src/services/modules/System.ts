import { Get } from '../decorator/http';

export class System {
  @Get({ url: '/mock/user_info.json' })
  static async getUserInfo(params: any = {}) {
    return params;
  }

  @Get({ url: '/mock/user_menus.json' })
  static async getUserMenus(params: any = {}) {
    return params;
  }
}
