export const generateRandomString = (length: number) => {
    const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const values = crypto.getRandomValues(new Uint8Array(length))
    return values.reduce((acc, x) => acc + possible[x % possible.length], "")
}

export const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest("SHA-256", data)
}

export const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
}

export const getAverageRgb = async (
    src: string
): Promise<Uint8ClampedArray> => {
    /* https://stackoverflow.com/questions/2541481/get-average-color-of-image-via-javascript */
    return new Promise((resolve) => {
        const context = document.createElement("canvas").getContext("2d")
        context!.imageSmoothingEnabled = true

        const img = new Image()
        img.src = src
        img.crossOrigin = ""

        img.onload = () => {
            context!.drawImage(img, 0, 0, 1, 1)
            resolve(context!.getImageData(0, 0, 1, 1).data.slice(0, 3))
        }
    })
}
