export interface IGetPlaybackToken {
    clientId: string
    code: string
    redirectUri: string
    codeVerifier: string
}

export interface IVinylProps {
    playbackToken: string
    refreshToken: string
    setPlaybackToken: (token: string) => void
    setRefreshToken: (token: string) => void
}

export interface ILoginProps {
    playbackToken: string
    setPlaybackToken: (token: string) => void
    setRefreshToken: (token: string) => void
}
