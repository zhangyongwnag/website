import './directives.css'

export default {
  bind(el, binding) {
    if (binding.value) return
    // el.style.position = 'relative'
    el.className += ' activeElement'
  }
}
