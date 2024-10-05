import React, { useEffect, useRef } from "react"
import { ImSpotify } from "react-icons/im"
import { base64encode, generateRandomString, sha256 } from "./utils"
import { getPlaybackToken } from "./api"
import { ILoginProps } from "./interface"
import {
    CODE_VERIFIER_KEY,
    SPOTIFY_AUTH_URL,
    SPOTIFY_MODIFY_PLAYBACK_STATE_SCOPE,
    SPOTIFY_READ_PLAYBACK_STATE_SCOPE,
} from "./constants"

const Login = ({
    playbackToken,
    setPlaybackToken,
    setRefreshToken,
}: ILoginProps) => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID
    const redirectUri = process.env.REACT_APP_REDIRECT_URI

    // prevent multiple calls to get token
    const hasFetchedToken = useRef(false)

    useEffect(() => {
        const getToken = async () => {
            if (hasFetchedToken.current) return
            hasFetchedToken.current = true
            try {
                // stored in the previous step
                let codeVerifier = localStorage.getItem(CODE_VERIFIER_KEY)

                const body = await getPlaybackToken({
                    clientId: clientId ?? "",
                    code: code ?? "",
                    redirectUri: redirectUri ?? "",
                    codeVerifier: codeVerifier ?? "",
                })
                const response = await body.json()
                setPlaybackToken(response?.access_token)
                setRefreshToken(response?.refresh_token)
                // clear code from URL
                window.history.replaceState({}, document.title, "/")
            } catch (error) {
                console.error("Error getting token", error)
            }
        }

        const urlParams = new URLSearchParams(window.location.search)
        let code = urlParams.get("code")
        if (code && playbackToken === "") {
            getToken()
        }
    }, [
        clientId,
        playbackToken,
        redirectUri,
        setPlaybackToken,
        setRefreshToken,
    ])

    const handleLogin = async () => {
        try {
            const codeVerifier = generateRandomString(64)

            const hashed = await sha256(codeVerifier)
            const codeChallenge = base64encode(hashed)

            const scope = `${SPOTIFY_MODIFY_PLAYBACK_STATE_SCOPE}, ${SPOTIFY_READ_PLAYBACK_STATE_SCOPE}`
            const authUrl = new URL(SPOTIFY_AUTH_URL)

            // generated in the previous step
            window.localStorage.setItem(CODE_VERIFIER_KEY, codeVerifier)

            const params = {
                response_type: "code",
                client_id: clientId ?? "",
                scope,
                code_challenge_method: "S256",
                code_challenge: codeChallenge,
                redirect_uri: redirectUri ?? "",
            }

            authUrl.search = new URLSearchParams(params).toString()
            window.location.href = authUrl.toString()
        } catch (error) {
            console.error("Error logging in", error)
        }
    }

    return (
        <button onClick={handleLogin} className="login-button">
            <ImSpotify />
            Click to get started
        </button>
    )
}

export default Login
