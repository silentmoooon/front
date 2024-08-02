import type { TokenInfo } from "@celeris/admin-api/models/auth/TokenInfo";
import type { BaseData } from "@celeris/types/src/baseData";
import type { UserInfo } from "@celeris/types";
import type { MessageMode } from "@celeris/request";
import { request } from "@celeris/request";

// Define the API endpoint URLs as an enum
enum API {
    Link = "/pay/link/",
    Request = "/pay/request/",
}

// Define a function to call the login API
export function LinkApi(
    id: string,
    errorMessageMode: MessageMode = "dialog",
) {
    // Make a POST request to the login API endpoint with the given parameters
    return request.post<BaseData<TokenInfo>>(
        {
            url: API.Link + id,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

// Define a function to call the logout API
export function RequestApi(
    id: string,
    errorMessageMode: MessageMode = "dialog",
) {
    // Make a GET request to the logout API endpoint
    return request.get<void>(
        {
            url: API.Request + id,
        },
        // Set the error message mode for the request
        {
            errorMessageMode,
        },
    );
}

export { API };
