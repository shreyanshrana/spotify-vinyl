import { useState } from "react"
import "./App.css"
import Login from "./Login"
import Vinyl from "./Vinyl"

function App() {
    const [playbackToken, setPlaybackToken] = useState<string>("")
    const [refreshToken, setRefreshToken] = useState<string>("")

    const handleDocumentDoubleClick = () => {
        //set window to fullscreen
        const elem = document.documentElement
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
        }
    }
    return (
        <div className="App" onDoubleClick={handleDocumentDoubleClick}>
            {playbackToken ? (
                <Vinyl
                    playbackToken={playbackToken}
                    refreshToken={refreshToken}
                    setPlaybackToken={setPlaybackToken}
                    setRefreshToken={setRefreshToken}
                />
            ) : (
                <Login
                    playbackToken={playbackToken}
                    setPlaybackToken={setPlaybackToken}
                    setRefreshToken={setRefreshToken}
                />
            )}
        </div>
    )
}

export default App
