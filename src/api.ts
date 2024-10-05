import {
    GRANT_TYPE_AUTHORIZATION_CODE,
    GRANT_TYPE_REFRESH_TOKEN,
    SPOTIFY_PLAYER_API_URL,
    SPOTIFY_TOKEN_API_URL,
} from "./constants"
import { IGetPlaybackToken } from "./interface"

export const getPlaybackToken = ({
    clientId,
    code,
    redirectUri,
    codeVerifier,
}: IGetPlaybackToken) => {
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
            code: code,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier,
        }),
    }
    return fetch(SPOTIFY_TOKEN_API_URL, payload)
}

export const getRefreshedPlaybackToken = (
    clientId: string,
    refreshToken: string
) => {
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            client_id: clientId,
            grant_type: GRANT_TYPE_REFRESH_TOKEN,
            refresh_token: refreshToken,
        }),
    }

    return fetch(SPOTIFY_TOKEN_API_URL, payload)
}

export const getPlaybackStatusFromSpotify = (playbackToken: string) => {
    const payload = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${playbackToken}`,
        },
    }
    return fetch(SPOTIFY_PLAYER_API_URL, payload)
}

export const changeTrackInSpotify = (
    playbackToken: string,
    direction: "next" | "previous"
) => {
    const url = `${SPOTIFY_PLAYER_API_URL}/${direction}`
    const payload = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${playbackToken}`,
        },
    }
    return fetch(url, payload)
}

export const togglePlaybackInSpotify = (
    playbackToken: string,
    status: "play" | "pause"
) => {
    const url = `${SPOTIFY_PLAYER_API_URL}/${status}`
    const payload = {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${playbackToken}`,
        },
    }
    return fetch(url, payload)
}
