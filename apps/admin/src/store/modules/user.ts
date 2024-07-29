import type { MessageMode } from "@celeris/request";
import type { UserInfo } from "@celeris/types/src/user";
import type { BaseData } from "@celeris/types/src/baseData";
import type { TokenInfo } from "@celeris/admin-api/models/auth/TokenInfo";
import { defineStore } from "pinia";
import { field, getErrorMessage, logger } from "@celeris/utils";
import type { RoleConstants } from "@celeris/constants";
import { PageConstants, PermissionCacheTypeConstants } from "@celeris/constants";
import { APP_USER_STORE_ID } from "../constants";
import { loginApi, logoutApi, userInfoApi } from "~/apis/internal/auth";

import type { LoginParams } from "~/apis/internal/auth";
import { DEFAULT_PROJECT_SETTING } from "~/setting/projectSetting";
import { router } from "~/router";
import { PAGE_NOT_FOUND_ROUTE } from "~/router/routes/basic";
import { usePermissionStore } from "~/store/modules/permission";

interface UserState {
    // Whether the user should be logged in
    // 用户是否应该已登录
    shouldLoggedIn: boolean;

    // User information, may be null
    // 用户信息，可能为空
    userInfo: UserInfo | null;

    // User's token obtained after logging in
    // 用户登录后获取的 Token 令牌
    token?: string;

    tokenInfo?: TokenInfo;

    // User's refresh token obtained after logging in
    // 用户登录后获取的刷新 Token
    refreshToken?: string;

    // List of roles for the user
    // 用户的角色列表
    roleList: RoleConstants[];

    // Whether the password has expired, optional
    // 密码是否已过期，可选
    shouldPasswordExpired?: boolean;

    // Last time user information was updated, optional
    // 用户信息最后更新时间，可选
    updatedAt?: Date | number;
}

export const useUserStore = defineStore({
    id: APP_USER_STORE_ID,
    persist: {
        paths: ["userInfo", "token", "refreshToken", "roleList", "updatedAt"],
        storage: DEFAULT_PROJECT_SETTING.permissionCacheType === PermissionCacheTypeConstants.LOCAL_STORAGE ? localStorage : sessionStorage,
    },
    state: (): UserState => ({
    // Whether the user should be logged in
    // 用户是否应该已登录
        shouldLoggedIn: false,

        // User information, may be null
        // 用户信息，可能为空
        userInfo: null,

        // User's token obtained after logging in
        // 用户登录后获取的 Token 令牌
        token: undefined,

        // User's refresh token obtained after logging in
        // 用户登录后获取的刷新 Token
        refreshToken: undefined,

        // List of roles for the user
        // 用户的角色列表
        roleList: [],

        // Whether the password has expired, optional
        // 密码是否已过期，可选
        shouldPasswordExpired: undefined,

        // Last time user information was updated, optional
        // 用户信息最后更新时间，可选
        updatedAt: undefined,
    }),
    getters: {
    // Whether the user should be logged in
    // 用户是否应该已登录
        getShouldLoggedIn(state): boolean {
            return state.shouldLoggedIn;
        },
        // Get user information
        // 获取用户信息
        getUserInfo(state): UserInfo | null {
            return state.userInfo;
        },
        // Get user token
        // 获取用户 Token
        getToken(state): string | undefined {
            return state.token;
        },
        // Get user refresh token
        // 获取用户刷新 Token
        getRefreshToken(state): string | undefined {
            return state.refreshToken;
        },
        // Get user role list
        // 获取用户角色列表
        getRoleList(state): RoleConstants[] {
            return state.roleList;
        },
        // Get whether the password has expired
        // 获取密码是否已过期
        getShouldPasswordExpired(state): boolean | undefined {
            return state.shouldPasswordExpired;
        },
        // Get the last time user information was updated
        // 获取用户信息最后更新时间
        getUpdatedAt(state): Date | number | undefined {
            return state.updatedAt;
        },
    },
    actions: {
    // Set whether the user should be logged in
    // 设置用户是否应该已登录
        setShouldLoggedIn(shouldLoggedIn: boolean) {
            this.shouldLoggedIn = shouldLoggedIn;
        },
        // Set user information
        // 设置用户信息
        setUserInfo(userInfo: UserInfo | null) {
            this.userInfo = userInfo;
            this.updatedAt = Date.now();
        },
        // Set user token
        // 设置用户 Token
        setToken(token: TokenInfo) {
            this.token = token.tokenValue;
            this.tokenInfo = token;
        },
        // Set user refresh token
        // 设置用户刷新 Token
        setRefreshToken(refreshToken: string) {
            this.refreshToken = refreshToken;
        },
        // Set user role list
        // 设置用户角色列表
        setRoleList(roleList: RoleConstants[]) {
            this.roleList = roleList;
        },
        // Set whether the password has expired
        // 设置密码是否已过期
        setShouldPasswordExpired(shouldPasswordExpired: boolean) {
            this.shouldPasswordExpired = shouldPasswordExpired;
        },
        // Set the last time user information was updated
        // 设置用户信息最后更新时间
        setUpdatedAt(updatedAt: Date | number) {
            this.updatedAt = updatedAt;
        },

        // 重置用户信息
        // Reset user information
        resetUserState() {
            this.shouldLoggedIn = false;
            this.userInfo = null;
            this.token = undefined;
            this.refreshToken = undefined;
            this.roleList = [];
            this.shouldPasswordExpired = undefined;
            this.updatedAt = undefined;
        },

        /**
         * Logs the user in and retrieves their information.
         * 登录用户并获取其信息。
         * @param {string} walletAddress - The username of the user.
         * @param {string} signature- The password of the user.
         * @param {string} walletName- The password of the user.
         * @param {string} walletType- The password of the user.
         * @param {string} loginText- Whether to remember the user. 是否记住用户
         * @returns {Promise<UserInfo|null>} The user's information or null if there was an error.
         */
        async login(payload:
            { walletAddress: string; signature: string; plainText: string; walletName: string; walletType: string }) {
            try {
                const data = await loginApi(payload);

                if (!data) {
                    return;
                }
                this.setToken(data);
                this.performAfterLoginAction();
                return data;
            } catch (error) {
                return Promise.reject(error);
            }
        },
        async performAfterLoginAction(redirectToHome = true) {
            if (!this.getToken) {
                return null;
            }
            this.setShouldLoggedIn(true);

            if (redirectToHome) {
                await router.replace("/dashboard/index");
            }
        },
        /**
         * Retrieves the user's information.
         * 获取用户信息。
         * @returns {Promise<UserInfo|null>} The user's information or null if there was an error.
         */
        async getUserInfoAction(): Promise<UserInfo | null> {
            if (!this.getToken) {
                return null;
            }
            const userInfo = await userInfoApi();
            const { roles = [] } = userInfo;
            this.setRoleList(roles);
            this.setUserInfo(userInfo);
            return userInfo;
        },

        /**
         * Logs the user out and resets the user's state.
         * 登出用户并重置用户状态。
         * @param {boolean} [redirectToLogin] - Whether to redirect to the login page after logout.
         */
        async logout(redirectToLogin = true) {
            if (this.getToken) {
                try {
                    await logoutApi();
                } catch (error: any) {
                    logger.error("logout error", field("error", getErrorMessage(error)));
                }
            }
            this.resetUserState();
            if (redirectToLogin) {
                await router.push(PageConstants.BASE_LOGIN);
            }
        },
    },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function useUserStoreWithOut() {
    return useUserStore(store);
}
