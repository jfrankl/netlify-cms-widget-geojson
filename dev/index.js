import './bootstrap.js'
import CMS, { init } from 'netlify-cms'
import 'netlify-cms/dist/cms.css'
import { GeoControl, GeoPreview } from '../src'

const config = {
  backend: {
    name: 'test-repo',
    login: false,
  },
  media_folder: 'assets',
  collections: [{
    name: 'test',
    label: 'Test',
    create: true,
    files: [{
      file: 'test.yml',
      name: 'test',
      label: 'Test',
      fields: [{ 
        name: 'test_widget', 
        label: 'Test Widget', 
        widget: 'test',
        draw: 'polygon',
        single: true,
        lat: 50.076091,
        lng: -75.4002,
        zoom: 4
      }],
    }],
  }],
}

CMS.registerWidget('test', GeoControl, GeoPreview)

init({ config })
