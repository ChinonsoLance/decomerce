import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/**
 * Picks the render tier before React mounts, so nothing expensive ever gets
 * built on a device that cannot afford it.
 *
 * `perf-lite` drops the film grain, the light beams, the drifting orbs, the
 * card sheen and the dust field. The composition and the colour are unchanged
 * — the page simply stops repainting itself.
 *
 * The tests are deliberately conservative: a false positive costs a bit of
 * atmosphere, a false negative costs a customer a janky page. Fallbacks are
 * generous so browsers that do not expose these APIs (Safari, Firefox) get the
 * full scene rather than being downgraded by a missing value.
 */
function selectRenderTier() {
  const cores = navigator.hardwareConcurrency || 8
  const memory = navigator.deviceMemory || 8

  const lite =
    // Phones and small tablets: fill rate is the constraint here, and on a
    // narrow screen the backdrop is mostly hidden behind content anyway.
    window.matchMedia('(max-width: 820px)').matches ||
    // No fine pointer means a touch device on a mobile GPU.
    window.matchMedia('(pointer: coarse)').matches ||
    cores <= 2 ||
    memory <= 2 ||
    navigator.connection?.saveData === true

  if (lite) document.documentElement.classList.add('perf-lite')
}

selectRenderTier()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
