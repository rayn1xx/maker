document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[contenteditable]').forEach(el => {
    const saved = localStorage.getItem(el.id)
    if (saved) el.innerHTML = saved
    el.addEventListener('blur', () => {
      localStorage.setItem(el.id, el.innerHTML)
      el.classList.add('edited')
      setTimeout(() => el.classList.remove('edited'), 500)
    })
  })

  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const circle = document.createElement('span')
      const d = Math.max(this.clientWidth, this.clientHeight)
      circle.style.width = circle.style.height = d + 'px'
      const rect = this.getBoundingClientRect()
      circle.style.left = e.clientX - rect.left - d/2 + 'px'
      circle.style.top  = e.clientY - rect.top  - d/2 + 'px'
      this.appendChild(circle)
      circle.addEventListener('animationend', () => circle.remove())
    })
  })

  const intBtn = document.getElementById('add-interest-btn')
  intBtn.addEventListener('click', () => {
    const input = document.getElementById('new-interest')
    const v = input.value.trim()
    if (!v) return
    const container = document.getElementById('interests-container')
    const span = document.createElement('span')
    span.textContent = v
    container.appendChild(span)
    localStorage.setItem('interests-container', container.innerHTML)
    input.value = ''
  })
  const savedInts = localStorage.getItem('interests-container')
  if (savedInts) {
    document.getElementById('interests-container').innerHTML = savedInts
  }

  const toolBtn = document.getElementById('add-tool-btn')
  toolBtn.addEventListener('click', () => {
    const url = document.getElementById('new-tool-url').value.trim()
    const alt = document.getElementById('new-tool-alt').value.trim() || ''
    const group = document.getElementById('tool-group-select').value
    if (!url) return
    const grpEl = document.querySelector(`.tools-card .group[data-group="${group}"]`)
    const img = document.createElement('img')
    img.src = url
    img.alt = alt
    grpEl.appendChild(img)
    document.getElementById('new-tool-url').value = ''
    document.getElementById('new-tool-alt').value = ''
  })

  const downloadBtn = document.getElementById('downloadBtn')
  if (downloadBtn && window.jspdf && window.jspdf.jsPDF) {
    const { jsPDF } = window.jspdf
    downloadBtn.addEventListener('click', () => {
      const resumeEl = document.querySelector('.resume')
      const addToolPanel = document.querySelector('.add-tool')
      const addInterestPanel = document.querySelector('.add-interest')
      downloadBtn.style.display = 'none'
      if (addToolPanel) addToolPanel.style.display = 'none'
      if (addInterestPanel) addInterestPanel.style.display = 'none'
      html2canvas(resumeEl, { useCORS: true, scale: 2 }).then(canvas => {
        const img = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p','pt','a4')
        const w = pdf.internal.pageSize.getWidth()
        const h = pdf.internal.pageSize.getHeight()
        const iw = canvas.width, ih = canvas.height
        const ratio = Math.min(w/iw, h/ih)
        pdf.addImage(img, 'PNG', 0, 0, iw*ratio, ih*ratio)
        pdf.save('resume.pdf')
      }).finally(() => {
        downloadBtn.style.display = ''
        if (addToolPanel) addToolPanel.style.display = ''
        if (addInterestPanel) addInterestPanel.style.display = ''
      })
    })
  }
})