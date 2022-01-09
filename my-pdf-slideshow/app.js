/**
 * GitHub Repository https://github.com/hrkt/my-pdf-slideshow
 * (C) 2022 Hiroki Ito
 */

'use strict'

// Loaded via <script> tag, create shortcut to access PDF.js exports.
const pdfjsLib = window['pdfjs-dist/build/pdf']

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = './lib/pdfjs/pdf.worker.js'

// variables for pdflib
let pdfDoc = null
let pageNum = 1
let pageRendering = false
let pageNumPending = null
const canvas = document.getElementById('the-canvas')
const ctx = canvas.getContext('2d')

// other variables

// buffer for numbers + Enter
let numberBuffer = ''

/**
 * get menu-area
 * @returns an element
 */
function getMenuArea () {
  return document.getElementById('menu-area')
}

/**
 * get page-navigator
 * @returns an element
 */
function getPageNavigator () {
  return document.getElementById('page-navigator')
}

/**
 * get input-file
 * @returns an element
 */
function getInputFileElement () {
  return document.getElementById('input-file')
}

/**
 * writes debug message to the console
 * @param {*} msg
 */
function debug (msg) {
  // console.log(msg)
}

/**
 * determine if passing through key event to browser is needed or not.
 *
 *
 * specifically for passing through 'KeyF' event to browser on macOS
 *
 * @param {*} evt
 * @returns true if event hould be passed throught to browser.
 */
function shouldPassThroughKeyEvent (evt) {
  if (navigator.userAgent.indexOf('Mac') && evt.key === 'KeyF') {
    // on macOS, Fn + F is assigned to 'Full Screen' by default.
    // For this reason, we pass through this key event to browser.
    return false
  }
  return true
}

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage (num) {
  pageRendering = true
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function (page) {
    // treat scaling

    debug('window.devicePixelRatio' + window.devicePixelRatio)

    const desiredWidth = document.documentElement.clientWidth
    const desiredHeight = document.documentElement.clientHeight
    debug('desiredWidth: ' + desiredWidth + ' desiredHeight: ' + desiredHeight)

    const viewport = page.getViewport({ scale: 1 })
    const scaleW = desiredWidth / viewport.width
    const scaleH = desiredHeight / viewport.height

    const scale = Math.min(scaleW, scaleH)

    debug('scale:' + scale)
    const scaledViewport = page.getViewport({ scale: scale })

    debug('viewport: ' + viewport.width + ' x ' + viewport.height)
    debug('scaled: ' + scaledViewport.width + ' x ' + scaledViewport.height)
    canvas.height = Math.floor(scaledViewport.height)
    canvas.width = Math.floor(scaledViewport.width)

    // Render PDF page into canvas context
    const renderContext = {
      canvasContext: ctx,
      viewport: scaledViewport
    }
    const renderTask = page.render(renderContext)

    // Wait for rendering to finish
    renderTask.promise.then(function () {
      pageRendering = false
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending)
        pageNumPending = null
      }
    })
  })

  updatePageNumLabel(num)
}

/**
 * adds the page number into render-queue
 *
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 * @param {*} num page number
 */
function queueRenderPage (num) {
  if (pageRendering) {
    pageNumPending = num
  } else {
    renderPage(num)
  }
}

/**
 * displays previous page.
 */
function onPrevPage () {
  if (pdfDoc === null || pageNum <= 1) {
    return
  }
  pageNum--
  queueRenderPage(pageNum)
}

/**
 * displays next page.
 */
function onNextPage () {
  if (pdfDoc === null || pageNum >= pdfDoc.numPages) {
    return
  }
  pageNum++
  queueRenderPage(pageNum)
}

/**
 * updates the page num label in the navigator
 * @param {*} num page num
 */
function updatePageNumLabel (num) {
  document.getElementById('page_num').textContent = num
}

/**
 * updates the page count label in the navigator
 * @param {*} num page num
 */
function updatePageCountLabel (num) {
  document.getElementById('page_count').textContent = num
}

/**
 * updates browser's window title
 * @param {*} txt
 */
function updateTitle (txt) {
  document.title = txt
}

/**
 * reads an pdf file from a HTML file object.
 */
function readPdfFile (file) {
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = function () {
    const pdfData = reader.result
    const loadingTask = pdfjsLib.getDocument({ data: pdfData })
    loadingTask.promise.then(function (pdfDoc_) {
      pdfDoc = pdfDoc_
      updatePageCountLabel(pdfDoc.numPages)
      updateTitle(file.name)

      // Initial/first page rendering
      renderPage(pageNum)
      // hideMenu()
      hideInitialMessage()
    })
  }
}

/**
 * shows menu
 */
function showMenu () {
  getMenuArea().style.visibility = 'visible'
  showPageNavigator()
}

/**
 * hides menu
 */
function hideMenu () {
  getMenuArea().style.visibility = 'hidden'
  hidePageNavigator()
}

/**
 * shows page-navigator
 */
function showPageNavigator () {
  getPageNavigator().style.visibility = 'visible'
}

/**
 * hides page-navigator
 */
function hidePageNavigator () {
  getPageNavigator().style.visibility = 'hidden'
}

/**
 * hides initial hint-message
 */
function hideInitialMessage () {
  document.getElementById('initial-message').style.visibility = 'hidden'
}

/**
 * handles generic short cuts
 *
 * <ul>
 * - opening file
 * - toggle menu
 * - digits + enter
 * </ul>
 *
 * @param {*} evt
 * @returns true if event is handled in this function, otherwise false
 */
function handleGenericShortCut (evt) {
  debug(`Key pressed ${evt.name}, code: ${evt.code}`)
  switch (evt.code) {
    case 'KeyO': {
      evt.preventDefault()
      getInputFileElement().click()
      break
    }
    case 'Period': {
      evt.preventDefault()
      if (getMenuArea().style.visibility === 'visible') {
        hideMenu()
      } else {
        showMenu()
      }
      break
    }
    case 'Digit0': {
      evt.preventDefault()
      numberBuffer += '0'
      break
    }
    case 'Digit1': {
      evt.preventDefault()
      numberBuffer += '1'
      break
    }
    case 'Digit2': {
      evt.preventDefault()
      numberBuffer += '2'
      break
    }
    case 'Digit3': {
      evt.preventDefault()
      numberBuffer += '3'
      break
    }
    case 'Digit4': {
      evt.preventDefault()
      numberBuffer += '4'
      break
    }
    case 'Digit5': {
      evt.preventDefault()
      numberBuffer += '5'
      break
    }
    case 'Digit6': {
      evt.preventDefault()
      numberBuffer += '6'
      break
    }
    case 'Digit7': {
      evt.preventDefault()
      numberBuffer += '7'
      break
    }
    case 'Digit8': {
      evt.preventDefault()
      numberBuffer += '8'
      break
    }
    case 'Digit9': {
      evt.preventDefault()
      numberBuffer += '9'
      break
    }
    case 'Enter': {
      evt.preventDefault()
      debug(numberBuffer)
      pageNum = parseInt(numberBuffer)
      debug(pageNum)
      if (isNaN(pageNum)) {
        // a digit is not specified. ignore this event.
        return true
      }
      if (pageNum <= 0) {
        pageNum = 1
      } else if (pageNum > pdfDoc.numPages) {
        pageNum = pdfDoc.numPages
      }

      debug('go to page:' + pageNum)
      queueRenderPage(pageNum)
      numberBuffer = ''
      break
    }
    default: {
      return false
    }
  }
  return true
}

/**
 * handles "less" command style short cuts
 *
 * @param {*} evt
 * @returns true if event is handled in this function, otherwise false
 */
function handleLessStyleShortCut (evt) {
  const key = evt.keyCode || evt.charCode || 0
  debug(key, evt.metaKey, evt.keyCode, evt.charCode)
  switch (evt.code) {
    case 'KeyB': {
      evt.preventDefault()
      onPrevPage()
      break
    }
    case 'KeyF': {
      if (!shouldPassThroughKeyEvent(evt)) {
        evt.preventDefault()
      }
      onNextPage()
      return true
    }
    case 'Space': {
      evt.preventDefault()
      onNextPage()
      break
    }
    case 'KeyP': {
      evt.preventDefault()
      pageNum = 1
      queueRenderPage(pageNum)
      break
    }
    case 'KeyG': {
      evt.preventDefault()
      pageNum = pdfDoc.numPages
      queueRenderPage(pageNum)
      break
    }
    case 'KeyR': {
      evt.preventDefault()
      queueRenderPage(pageNum)
      break
    }
    default: {
      // do nothing
      return false
    }
  }
  return true
}

/**
 * set up handlers for resize event
 */
function setupResizeEventHandlers () {
  window.addEventListener(
    'resize',
    _.debounce(
      () => {
        renderPage(pageNum)
      },
      500,
      { maxWait: 2000 }
    ),
    true
  )

  document.addEventListener(
    'fullscreenchange',
    _.debounce(
      () => {
        renderPage(pageNum)
      },
      500,
      { maxWait: 2000 }
    ),
    true
  )
}

/**
 * set up handlers for navigation controller event
 */
function setupNavigationControllerHandlers () {
  getInputFileElement().addEventListener(
    'change',
    function (e) {
      e.preventDefault()
      readPdfFile(e.target.files[0])
    },
    { passive: false }
  )

  document
    .getElementById('prev')
    .addEventListener('click', onPrevPage, { passive: false })

  document
    .getElementById('next')
    .addEventListener('click', onNextPage, { passive: false })
}

/**
 * init this app
 */
function init () {
  document.documentElement.style.overflow = 'hidden'

  setupNavigationControllerHandlers()
  setupResizeEventHandlers()

  getMenuArea().addEventListener('click', hideMenu, { passive: false })

  // handles short cut keys
  document.addEventListener(
    'keydown',
    (evt) => {
      if (!handleGenericShortCut(evt)) {
        handleLessStyleShortCut(evt)
      }
    },
    false
  )
}

// call init() when DOM is ready
window.onload = init()
