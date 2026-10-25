let ctx: AudioContext | null = null

/** Korte "ding-ding-ding" met WebAudio, zonder audiobestand. */
export function playDing() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    if (ctx.state === 'suspended') void ctx.resume()
    const now = ctx.currentTime
    ;[880, 1174, 1568].forEach((freq, i) => {
      const osc = ctx!.createOscillator()
      const gain = ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0.0001, now + i * 0.22)
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.22 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.22 + 0.5)
      osc.connect(gain).connect(ctx!.destination)
      osc.start(now + i * 0.22)
      osc.stop(now + i * 0.22 + 0.55)
    })
  } catch {
    /* geluid is optioneel */
  }
}

/** Zorgt dat audio is ontgrendeld na een gebruikersactie (nodig op iOS/Safari). */
export function unlockAudio() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return
    ctx = ctx ?? new AC()
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    /* negeren */
  }
}
