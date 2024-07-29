import type { TokenInfo } from "@celeris/admin-api/models/auth/TokenInfo";
import type { BaseData } from "@celeris/types/src/baseData";
import type { UserInfo } from "@celeris/types";
import type { MessageMode } from "@celeris/request";
import { request } from "@celeris/request";

// Define the API endpoint URLs as an enum
enum API {
    Login = "/login/wallet",
    Logout = "/user/logout",
    UserInfo = "/user/info",
    PermissionCode = "/auth/permission-code",
}

// Define the parameters for the login API
export interface LoginParams {
    username: string;
    password: string;
}

export interface WalletLoginParams {
    username: string;
    password: string;
}

// Define a function to call the login API
export function loginApi(
    params: { walletAddress: string; signature: string; plainText: string; walletName: string; walletType: string },
    errorMessageMode: MessageMode = "dialog",
) {
    // Make a POST request to the login API endpoint with the given parameters
    return request.post<BaseData<TokenInfo>>(
        {
            url: API.Login,
            params,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

// Define a function to call the logout API
export function logoutApi(
    errorMessageMode: MessageMode = "dialog",
) {
    // Make a GET request to the logout API endpoint
    return request.get<void>(
        {
            url: API.Logout,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

// Define a function to call the user info API
export function userInfoApi(
    errorMessageMode: MessageMode = "none",
) {
    // Make a GET request to the user info API endpoint
    return request.get<UserInfo>(
        {
            url: API.UserInfo,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

// Define a function to call the permission code API
export function permissionCodeApi(
    errorMessageMode: MessageMode = "dialog",
) {
    // Make a GET request to the permission code API endpoint
    return request.get<string[]>(
        {
            url: API.PermissionCode,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

export { API };
