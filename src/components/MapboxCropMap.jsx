import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { buildCropPointsGeoJSON, majorCities, PAKISTAN_BOUNDS } from '../lib/cropPoints.js'

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

// Swapping the base style (map.setStyle) wipes every custom source/layer, so this
// re-adds the always-on data layers on 'style.load' — which fires both on the
// initial load and after every subsequent setStyle call.
function addDataLayers(map) {
  if (map.getSource('pk-boundary')) return // already present, e.g. redundant fire

  map.addSource('pk-boundary', {
    type: 'geojson',
    data: '/pakistan-boundary.geojson',
  })
  map.addLayer({
    id: 'pk-boundary-fill',
    type: 'fill',
    source: 'pk-boundary',
    paint: {
      'fill-color': '#1a7a44',
      'fill-opacity': 0.05,
    },
  })
  map.addLayer({
    id: 'pk-boundary-line',
    type: 'line',
    source: 'pk-boundary',
    paint: {
      'line-color': '#ffffff',
      'line-width': 2,
      'line-opacity': 0.9,
    },
  })

  map.addSource('crop-points', {
    type: 'geojson',
    data: buildCropPointsGeoJSON(),
  })
  map.addLayer({
    id: 'crop-points-layer',
    type: 'circle',
    source: 'crop-points',
    paint: {
      'circle-radius': ['interpolate', ['linear'], ['zoom'], 4, 2, 8, 5],
      'circle-color': ['get', 'color'],
      'circle-opacity': 0.85,
      'circle-stroke-width': 0.4,
      'circle-stroke-color': 'rgba(0,0,0,0.2)',
    },
  })
}

export default function MapboxCropMap({ onMapLoad }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!MAPBOX_TOKEN) return
    if (mapRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12', // vector basemap — see CropMapOverview for why
      bounds: PAKISTAN_BOUNDS,
      fitBoundsOptions: { padding: 20 },
      attributionControl: false,
    })
    mapRef.current = map

    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    // Fires on initial load AND after every map.setStyle(...) — the one place
    // that reliably re-adds sources/layers a style swap just wiped out.
    map.on('style.load', () => addDataLayers(map))

    map.on('load', () => {
      majorCities.forEach((c) => {
        const el = document.createElement('div')
        el.style.cssText =
          'width:8px;height:8px;border-radius:50%;background:#111827;border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.2)'
        new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat([c.lon, c.lat])
          .setPopup(new mapboxgl.Popup({ offset: 10, closeButton: false }).setText(c.label))
          .addTo(map)

        const label = document.createElement('div')
        label.textContent = c.label
        label.style.cssText =
          'font-size:11px;font-weight:600;color:#111827;background:rgba(255,255,255,.8);padding:1px 5px;border-radius:4px;transform:translate(10px,-8px);white-space:nowrap;pointer-events:none'
        new mapboxgl.Marker({ element: label, anchor: 'left' }).setLngLat([c.lon, c.lat]).addTo(map)
      })

      onMapLoad?.(map)
    })

    const resizeObserver = new ResizeObserver(() => map.resize())
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-300 text-sm p-6 text-center">
        Missing Mapbox token — set <code className="mx-1 font-mono">VITE_MAPBOX_TOKEN</code> in .env
      </div>
    )
  }

  return <div ref={containerRef} className="w-full h-full" />
}
