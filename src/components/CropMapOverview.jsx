import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Filter, Maximize2, Minimize2, Plus, Minus, Layers, MapPinned, Loader2, Leaf, AlertTriangle, Building2 } from 'lucide-react'
import { cropLegend } from '../lib/cropPoints.js'
import { CLASSIFICATION_LABELS, ISLAMABAD_CENTER, ensureClassificationLayer } from '../lib/classification.js'
import { fetchVegetationTile } from '../lib/vegetationApi.js'
import { syncBuildingLayers, removeBuildingLayers } from '../lib/buildings.js'
import MapboxCropMap from './MapboxCropMap.jsx'

const STYLES = {
  streets: { label: 'Streets', url: 'mapbox://styles/mapbox/streets-v12' },
  light: { label: 'Light', url: 'mapbox://styles/mapbox/light-v11' },
  satellite: { label: 'Satellite', url: 'mapbox://styles/mapbox/satellite-v9' },
  hybrid: { label: 'Hybrid', url: 'mapbox://styles/mapbox/satellite-streets-v12' },
  outdoors: { label: 'Terrain', url: 'mapbox://styles/mapbox/outdoors-v12' },
}

const VEGETATION_SOURCE_ID = 'vegetation-index'
const VEGETATION_LAYER_ID = 'vegetation-index-layer'

export default function CropMapOverview() {
  const mapRef = useRef(null)
  // Defaults to the vector "streets" basemap rather than satellite imagery — raster/photo
  // tiles don't composite on machines without real GPU acceleration (software-rendered
  // WebGL), while vector layers (roads, our boundary + crop points) render everywhere.
  // Satellite/Hybrid/Terrain stay selectable in the layer picker for machines with real GPU support.
  const [styleKey, setStyleKey] = useState('streets')
  const [showLayers, setShowLayers] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showClassification, setShowClassification] = useState(false)
  const [classificationLoading, setClassificationLoading] = useState(false)

  // Live MODIS NDVI/EVI overlay (Earth Engine, via server/) — null when off.
  const [vegIndex, setVegIndex] = useState(null) // 'ndvi' | 'evi' | null
  const [vegLoading, setVegLoading] = useState(false)
  const [vegError, setVegError] = useState(null)
  const [vegMeta, setVegMeta] = useState(null) // { date, min, max, palette }

  // Building footprints (TileServer GL, LAN-only) — loaded per-district as the
  // viewport pans, see src/lib/buildings.js.
  const [showBuildings, setShowBuildings] = useState(false)
  const buildingsMoveHandlerRef = useRef(null)

  const handleMapLoad = (map) => {
    mapRef.current = map
  }

  const applyClassificationVisibility = (map, visible) => {
    const vis = visible ? 'visible' : 'none'
    if (map.getLayer('classification-fill')) map.setLayoutProperty('classification-fill', 'visibility', vis)
    if (map.getLayer('classification-line')) map.setLayoutProperty('classification-line', 'visibility', vis)
  }

  const loadClassification = (map) => {
    const alreadyLoaded = !!map.getSource('classification')
    ensureClassificationLayer(map)
    applyClassificationVisibility(map, true)
    if (alreadyLoaded) return
    setClassificationLoading(true)
    const check = () => {
      if (map.isSourceLoaded('classification')) {
        setClassificationLoading(false)
        map.off('sourcedata', check)
      }
    }
    map.on('sourcedata', check)
  }

  const removeVegetationLayer = (map) => {
    if (map.getLayer(VEGETATION_LAYER_ID)) map.removeLayer(VEGETATION_LAYER_ID)
    if (map.getSource(VEGETATION_SOURCE_ID)) map.removeSource(VEGETATION_SOURCE_ID)
  }

  const loadVegetationLayer = async (map, indexKey) => {
    setVegLoading(true)
    setVegError(null)
    try {
      const data = await fetchVegetationTile(indexKey)
      // A style swap (or a fast index switch) may have raced this request —
      // bail if the map's already moved on to something else.
      if (mapRef.current !== map) return
      removeVegetationLayer(map)
      map.addSource(VEGETATION_SOURCE_ID, { type: 'raster', tiles: [data.tileUrlTemplate], tileSize: 256 })
      // Insert below crop points / classification so those markers stay on top.
      const beforeId = map.getLayer('crop-points-layer') ? 'crop-points-layer' : undefined
      map.addLayer({ id: VEGETATION_LAYER_ID, type: 'raster', source: VEGETATION_SOURCE_ID, paint: { 'raster-opacity': 0.8 } }, beforeId)
      setVegMeta({ date: data.date, min: data.min, max: data.max, palette: data.palette })
    } catch (err) {
      setVegError(err.message)
    } finally {
      setVegLoading(false)
    }
  }

  const setStyle = (key) => {
    const map = mapRef.current
    setStyleKey(key)
    setShowLayers(false)
    if (!map) return
    map.setStyle(STYLES[key].url)
    // setStyle wipes all custom sources/layers; MapboxCropMap re-adds the always-on
    // ones via its own 'style.load' listener, but the lazily-loaded, optional
    // layers (classification, vegetation index) need to be explicitly restored here.
    map.once('style.load', () => {
      if (showClassification) loadClassification(map)
      if (vegIndex) loadVegetationLayer(map, vegIndex)
      if (showBuildings) syncBuildingLayers(map)
    })
  }

  const toggleClassification = () => {
    const map = mapRef.current
    const next = !showClassification
    setShowClassification(next)
    if (!map) return
    if (next) {
      loadClassification(map)
      map.flyTo({ center: ISLAMABAD_CENTER, zoom: 11, duration: 1200 })
    } else {
      applyClassificationVisibility(map, false)
    }
  }

  const toggleVegetation = (indexKey) => {
    const map = mapRef.current
    const next = vegIndex === indexKey ? null : indexKey
    setVegIndex(next)
    setVegError(null)
    if (!next) {
      setVegMeta(null)
      if (map) removeVegetationLayer(map)
      return
    }
    if (map) loadVegetationLayer(map, next)
  }

  const toggleBuildings = () => {
    const map = mapRef.current
    const next = !showBuildings
    setShowBuildings(next)
    if (!map) return
    if (next) {
      syncBuildingLayers(map)
      const handler = () => syncBuildingLayers(map)
      buildingsMoveHandlerRef.current = handler
      map.on('moveend', handler)
    } else {
      if (buildingsMoveHandlerRef.current) {
        map.off('moveend', buildingsMoveHandlerRef.current)
        buildingsMoveHandlerRef.current = null
      }
      removeBuildingLayers(map)
    }
  }

  useEffect(() => {
    if (!isFullscreen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isFullscreen])

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-surface-900 p-4 flex flex-col'
          : 'bg-surface-800 rounded-xl border border-surface-600 shadow-card p-3'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-50">Crop Map Overview</h3>
        <button
          className="flex items-center gap-1.5 text-xs text-forest-400 border border-forest-700 rounded-lg px-2.5 py-1 hover:bg-forest-900/40"
          onClick={() => setIsFullscreen((v) => !v)}
        >
          {isFullscreen ? (
            <>
              <Minimize2 size={12} /> Exit Full Screen
            </>
          ) : (
            <>
              <Maximize2 size={12} /> View Full Screen
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <button className="flex items-center gap-1 text-xs border border-surface-600 rounded-lg px-2 py-1 text-gray-300">
          Kharif 2024 <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-1 text-xs border border-surface-600 rounded-lg px-2 py-1 text-gray-300">
          All Crops <ChevronDown size={12} />
        </button>
        <button className="flex items-center gap-1 text-xs border border-surface-600 rounded-lg px-2 py-1 text-gray-300">
          <Filter size={12} /> Filters
        </button>
        <button
          onClick={toggleClassification}
          className={`flex items-center gap-1 text-xs rounded-lg px-2 py-1 border ${
            showClassification
              ? 'bg-forest-600 text-white border-forest-600'
              : 'border-surface-600 text-gray-300 hover:bg-surface-700'
          }`}
        >
          {classificationLoading ? <Loader2 size={12} className="animate-spin" /> : <MapPinned size={12} />}
          Islamabad Classification
        </button>

        <button
          onClick={toggleBuildings}
          className={`flex items-center gap-1 text-xs rounded-lg px-2 py-1 border ${
            showBuildings
              ? 'bg-forest-600 text-white border-forest-600'
              : 'border-surface-600 text-gray-300 hover:bg-surface-700'
          }`}
        >
          <Building2 size={12} />
          Buildings
        </button>

        <div className="flex items-center rounded-lg border border-surface-600 overflow-hidden">
          {['ndvi', 'evi'].map((key) => (
            <button
              key={key}
              onClick={() => toggleVegetation(key)}
              className={`flex items-center gap-1 text-xs px-2 py-1 uppercase ${
                vegIndex === key ? 'bg-forest-600 text-white' : 'text-gray-300 hover:bg-surface-700'
              }`}
            >
              {vegLoading && vegIndex === key ? <Loader2 size={12} className="animate-spin" /> : <Leaf size={12} />}
              {key}
            </button>
          ))}
        </div>
      </div>

      {vegError && (
        <div className="flex items-start gap-1.5 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2 py-1.5 mb-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>{vegError}</span>
        </div>
      )}

      <div
        className="relative rounded-lg overflow-hidden border border-surface-600 flex-1 min-h-0"
        style={isFullscreen ? undefined : { height: 360 }}
      >
        <MapboxCropMap onMapLoad={handleMapLoad} />

        <div className="absolute top-3 left-3 flex flex-col gap-1 bg-surface-800 rounded-lg shadow-card overflow-hidden border border-surface-600 z-10">
          <button className="p-2 hover:bg-surface-700 border-b border-surface-600 text-gray-200" onClick={() => mapRef.current?.zoomIn()}>
            <Plus size={15} />
          </button>
          <button className="p-2 hover:bg-surface-700 text-gray-200" onClick={() => mapRef.current?.zoomOut()}>
            <Minus size={15} />
          </button>
        </div>

        <div className="absolute top-14 left-3 z-10">
          <button
            className="p-2 bg-surface-800 rounded-lg shadow-card border border-surface-600 hover:bg-surface-700 text-gray-200"
            onClick={() => setShowLayers((v) => !v)}
          >
            <Layers size={15} />
          </button>
          {showLayers && (
            <div className="mt-1 bg-surface-800 rounded-lg shadow-card border border-surface-600 p-1 w-32 text-xs">
              {Object.entries(STYLES).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setStyle(key)}
                  className={`w-full text-left px-2 py-1.5 rounded ${
                    styleKey === key ? 'bg-forest-500/15 text-forest-400 font-medium' : 'hover:bg-surface-700 text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="absolute top-2 right-2 bg-surface-800/95 rounded-lg shadow-card border border-surface-600 p-2 w-40 z-10 max-h-[85%] overflow-y-auto space-y-2">
          <div>
            <p className="text-[11px] font-semibold text-gray-100 mb-1.5">Dominant Crop</p>
            <ul className="space-y-1">
              {cropLegend.map((l) => (
                <li key={l.crop} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                  {l.crop}
                </li>
              ))}
            </ul>
          </div>

          {vegIndex && (
            <div className="pt-2 border-t border-surface-600">
              <p className="text-[11px] font-semibold text-gray-100 mb-1.5">{vegIndex.toUpperCase()} (MODIS)</p>
              {vegMeta && (
                <>
                  <div
                    className="h-2.5 rounded-full mb-1"
                    style={{ background: `linear-gradient(to right, ${vegMeta.palette.join(',')})` }}
                  />
                  <div className="flex justify-between text-[9px] text-gray-400 mb-1.5">
                    <span>{vegMeta.min.toFixed(1)}</span>
                    <span>{vegMeta.max.toFixed(1)}</span>
                  </div>
                  <p className="text-[9px] text-gray-400">Composite: {vegMeta.date}</p>
                </>
              )}
            </div>
          )}

          {showClassification && (
            <div className="pt-2 border-t border-surface-600">
              <p className="text-[11px] font-semibold text-gray-100 mb-1.5">Islamabad Classification</p>
              <ul className="space-y-1">
                {Object.entries(CLASSIFICATION_LABELS).map(([dn, info]) => (
                  <li key={dn} className="flex items-center gap-1.5 text-[10px] text-gray-300">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.color }} />
                    {info.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {showBuildings && (
            <div className="pt-2 border-t border-surface-600">
              <p className="text-[11px] font-semibold text-gray-100 mb-1.5">Buildings</p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: '#d97706' }} />
                Footprints (visible from zoom 13)
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-3 text-[10px] bg-surface-800/85 px-2 py-1 rounded text-gray-400 z-10 max-w-[70%]">
          {[
            vegIndex && `MODIS ${vegIndex.toUpperCase()} (MOD13Q1) via Earth Engine${vegMeta ? ` | Composite: ${vegMeta.date}` : ''}`,
            showClassification && 'Islamabad classification | User-supplied data',
            showBuildings && 'Building footprints | TileServer GL (LAN)',
          ]
            .filter(Boolean)
            .join('  •  ') || 'Source: Sentinel-2 & Mapbox | Last Updated: 20 May 2024'}
        </div>
      </div>
    </div>
  )
}
