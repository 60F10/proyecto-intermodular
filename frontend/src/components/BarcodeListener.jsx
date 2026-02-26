import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import apiFetch from '../services/api'

/**
 * Global barcode/QR listener for keyboard-wedge scanners.
 * Collects keystrokes until Enter and then tries to resolve product by SKU.
 */
export default function BarcodeListener() {
  const bufferRef = useRef('')
  const navigate = useNavigate()

  useEffect(() => {
    let lastTime = Date.now()

    const onKeyDown = async (e) => {
      const now = Date.now()
      const elapsed = now - lastTime
      lastTime = now

      // Ignore modifier keys
      if (e.key === 'Shift' || e.key === 'Alt' || e.key === 'Control' || e.key === 'Meta') return

      if (e.key === 'Enter') {
        const code = bufferRef.current.trim()
        bufferRef.current = ''
        if (!code) return

        try {
          // Try backend SKU endpoint
          const res = await apiFetch(`/products/sku/${encodeURIComponent(code)}`)
          // If found, navigate to product detail by type
          if (res && res.productType) {
            const type = res.productType
            if (type === 'INGREDIENT') {
              navigate(`/products/${res.id}`)
            } else if (type === 'MATERIAL') {
              navigate(`/inventory/${res.id}`)
            } else {
              navigate(`/products/${res.id}`)
            }
            return
          }
        } catch (err) {
          // Not found or API error -> fall through to create flow
        }

        // If not found: infer destination by prefix (ING/MAT) or default to products
        const upper = code.toUpperCase()
        if (upper.startsWith('ING')) {
          navigate('/products/new', { state: { scannedCode: code } })
        } else if (upper.startsWith('MAT') || upper.startsWith('PROV') || upper.startsWith('M') ) {
          navigate('/inventory/new', { state: { scannedCode: code } })
        } else {
          // default to ingredients view
          navigate('/products/new', { state: { scannedCode: code } })
        }
      } else {
        // Append printable chars only. If time between keys is large, reset buffer.
        if (elapsed > 1000) bufferRef.current = ''
        // Some scanners send as characters; ignore non-printable keys
        if (e.key.length === 1) {
          bufferRef.current += e.key
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [navigate])

  return null
}
