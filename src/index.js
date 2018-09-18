import GeoControl from './Control'
import GeoPreview from './Preview'

if (typeof window !== 'undefined') {
  window.GeoControl = GeoControl
  window.GeoPreview = GeoPreview
}

export { GeoControl, GeoPreview }
