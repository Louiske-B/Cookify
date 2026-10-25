import { useEffect } from 'react'

/** Zet per pagina een passende titel en meta description. */
export function useDocumentMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === 'Cookify' ? 'Cookify – Iedereen kan leren koken' : `${title} | Cookify`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [title, description])
}
