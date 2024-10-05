import { useCallback, useEffect, useState } from "react"
import { PlaybackStatusEnum } from "./enum"
import {
    changeTrackInSpotify,
    getPlaybackStatusFromSpotify,
    getRefreshedPlaybackToken,
    togglePlaybackInSpotify,
} from "./api"
import { getAverageRgb } from "./utils"
import { ImPrevious2, ImNext2, ImPause2, ImPlay2 } from "react-icons/im"
import { IVinylProps } from "./interface"

const Vinyl = ({
    playbackToken,
    refreshToken,
    setPlaybackToken,
    setRefreshToken,
}: IVinylProps) => {
    const [albumArtUrl, setAlbumArtUrl] = useState<string>("")
    const [songProgress, setSongProgress] = useState<number>(0)
    const [songDetails, setSongDetails] = useState<{
        name: string
        artist: string
    } | null>(null)
    const [bgColor, setBgColor] = useState<string>("")
    const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatusEnum>(
        PlaybackStatusEnum.PAUSED
    )

    const isTrackPlaying = playbackStatus === PlaybackStatusEnum.PLAYING

    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID

    const getPlaybackStatus = useCallback(
        async (token: string) => {
            try {
                const body = await getPlaybackStatusFromSpotify(token)
                const response = await body.json()
                setAlbumArtUrl(response?.item?.album?.images[0]?.url ?? "")
                const res = await getAverageRgb(
                    response?.item?.album?.images[0]?.url
                )
                setBgColor(`${res[0]}, ${res[1]}, ${res[2]}`)
                setPlaybackStatus(
                    response?.is_playing
                        ? PlaybackStatusEnum.PLAYING
                        : PlaybackStatusEnum.PAUSED
                )
                setSongProgress(
                    (response?.progress_ms / response?.item?.duration_ms) * 100
                )
                setSongDetails({
                    name: response?.item?.name,
                    artist: response?.item?.artists[0]?.name,
                })
            } catch (error) {
                console.error("Error getting playback status", error)
            }
        },
        [setPlaybackStatus]
    )

    useEffect(() => {
        const refreshPlaybackToken = async () => {
            try {
                const body = await getRefreshedPlaybackToken(
                    clientId ?? "",
                    refreshToken
                )
                const response = await body.json()
                setPlaybackToken(response?.access_token)
                setRefreshToken(response?.refresh_token)
            } catch (error) {
                console.error("Error refreshing token", error)
            }
        }
        if (playbackToken) {
            // check status every 5 seconds
            const interval = setInterval(() => {
                getPlaybackStatus(playbackToken)
            }, 1000)

            const refreshInterval = setInterval(() => {
                refreshPlaybackToken()
            }, 1000 * 10 * 15)

            return () => {
                clearInterval(interval)
                clearInterval(refreshInterval)
            }
        }
    }, [
        clientId,
        getPlaybackStatus,
        playbackToken,
        refreshToken,
        setPlaybackToken,
        setRefreshToken,
    ])

    const togglePlayback = async () => {
        try {
            await togglePlaybackInSpotify(
                playbackToken,
                isTrackPlaying ? "pause" : "play"
            )
            setPlaybackStatus(
                isTrackPlaying
                    ? PlaybackStatusEnum.PAUSED
                    : PlaybackStatusEnum.PLAYING
            )
        } catch (error) {
            console.error("Error toggling playback", error)
        }
    }

    const moveTrack = async (direction: "next" | "previous") => {
        try {
            await changeTrackInSpotify(playbackToken, direction)
            getPlaybackStatus(playbackToken)
            setSongProgress(0)
        } catch (error) {
            console.error("Error changing track", error)
        }
    }

    return (
        <div
            style={{
                backgroundColor: `rgba(${bgColor},0.3)`,
            }}
            className="app-container"
        >
            <div className="playback-container">
                <div className="song-info">
                    <p>{songDetails?.name ?? ""}</p>
                    <h2>{songDetails?.artist ?? ""}</h2>
                </div>
                <div
                    className="album-container"
                    onMouseEnter={() => {
                        document.querySelector(".album")?.classList.add("blur")

                        document
                            .querySelector(".media-controls")
                            ?.classList.add("show")
                    }}
                    onMouseLeave={() => {
                        document
                            .querySelector(".album")
                            ?.classList.remove("blur")

                        document
                            .querySelector(".media-controls")
                            ?.classList.remove("show")
                    }}
                >
                    <div
                        style={{
                            backgroundImage: `url(${albumArtUrl})`,
                            backgroundColor: "#333",
                        }}
                        className={`album`}
                    />
                    <div
                        className="media-controls"
                        style={{
                            backgroundColor: `rgba(${bgColor},0.25)`,
                        }}
                    >
                        <button onClick={() => moveTrack("previous")}>
                            <ImPrevious2 />
                        </button>
                        <button onClick={togglePlayback}>
                            {isTrackPlaying ? <ImPause2 /> : <ImPlay2 />}
                        </button>
                        <button onClick={() => moveTrack("next")}>
                            <ImNext2 />
                        </button>
                    </div>
                </div>
                <div
                    className={`disc ${
                        isTrackPlaying ? "is-playing" : "is-paused"
                    }`}
                    style={{
                        backgroundColor: `rgba(${bgColor},1)`,
                    }}
                ></div>
            </div>
            <div className="song-progress">
                <div
                    style={{
                        width: `${songProgress}%`,
                        backgroundColor: `rgba(${bgColor},1)`,
                    }}
                    className="progress-bar"
                />
            </div>
        </div>
    )
}

export default Vinyl
