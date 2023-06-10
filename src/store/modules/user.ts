import { defineStore } from 'pinia';

import { LoginUser } from '@/api/model/loginUser';
import { TOKEN_NAME } from '@/config/global';
import { store, usePermissionStore } from '@/store';
import { request } from '@/utils/request';

export const useUserStore = defineStore('user', {
  state: () => ({
    [TOKEN_NAME]: 'main_token', // 默认token不走权限
  }),
  getters: {},
  actions: {
    async login(user: LoginUser): Promise<boolean> {
      try {
        const { token } = await request.post<LoginUser>({
          url: '/Login/Login',
          data: user,
        });
        if (token !== '用户名或者密码不正确！') {
          this.setToken(token);
          return true;
        }
      } catch (e) {
        console.log(e);
      }
      return false;
    },

    async logout() {
      this.removeToken();
    },
    async removeToken() {
      this.setToken('');
    },
    async setToken(token: string) {
      this[TOKEN_NAME] = token;
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: [TOKEN_NAME],
  },
});

export function getUserStore() {
  return useUserStore(store);
}
