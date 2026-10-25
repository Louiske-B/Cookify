const isUnsplash = (url: string) => url.includes('images.unsplash.com')

/** Voegt breedte/kwaliteit toe aan Unsplash-URL's. Data-URL's en andere bronnen blijven ongemoeid. */
export function sized(url: string, width: number) {
  if (!isUnsplash(url)) return url
  return `${url.split('?')[0]}?w=${width}&q=80&auto=format&fit=crop`
}

export function srcSet(url: string, widths: number[]) {
  if (!isUnsplash(url)) return undefined
  return widths.map((w) => `${sized(url, w)} ${w}w`).join(', ')
}

/** Verkleint een geüploade foto client-side: max. 1200px breed, JPEG kwaliteit 0.8. */
export function resizeImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(url)
        reject(new Error('Canvas niet beschikbaar'))
        return
      }
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Afbeelding kon niet worden gelezen'))
    }
    img.src = url
  })
}
