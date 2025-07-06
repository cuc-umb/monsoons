import WebGL from 'three/addons/capabilities/WebGL.js'

if (WebGL.isWebGL2Available()) {
  // Initiate function or other initializations here
  (function () {
    
  })()
} else {
  const warning = WebGL.getWebGL2ErrorMessage()
  document.getElementById('app')?.appendChild(warning)
}
