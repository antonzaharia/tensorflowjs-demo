const URL = 'https://teachablemachine.withgoogle.com/models/0jY_QsYJD/'

let model, labelContainer, maxPredictions
const watermarkLabel = document.getElementById('watermark')
const noWatermarkLabel = document.getElementById('no-watermark')

writeLabels = (prediction) => {
  prediction.map((p) => {
    if (p.className === 'watermark') {
      watermarkLabel.textContent = `Watermarked: ${parseInt(p.probability * 100)}%`
    } else if (p.className === 'no-watermark') {
      noWatermarkLabel.textContent = `No watermark: ${parseInt(p.probability * 100)}%`
    } else {
      watermarkLabel.textContent = 'Loading'
    }
  })
}

const predict = async (image) => {
  const modelURL = URL + 'model.json'
  const metadataURL = URL + 'metadata.json'
  model = await tmImage.load(modelURL, metadataURL)
  maxPredictions = model.getTotalClasses()

  const prediction = await model.predict(image)
  writeLabels(prediction)
}

const localPredict = async (image) => {
  var model = new File(['foo'], 'model/model.json', {
    type: 'json',
  })
  const uploadModel = document.getElementById('upload-model')
  const uploadWeights = document.getElementById('upload-weights')
  const uploadMetadata = document.getElementById('upload-metadata')
  model = await tmImage.loadFromFiles(model, uploadWeights.files[0], uploadMetadata.files[0])
  maxPredictions = model.getTotalClasses()

  const prediction = await model.predict(image)
  writeLabels(prediction)
}

const container = document.getElementById('container')
const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e) => res(e.target.result)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })
}
const imageInput = document.getElementById('image-input')
img = document.getElementById('image')
img.addEventListener('click', () => predict(img))

imageInput.addEventListener('change', async (e) => {
  e.preventDefault()
  writeLabels([])
  document.querySelectorAll('.box').forEach((e) => e.remove())

  const url = await readURL(e.target.files[0])
  img.setAttribute('src', url)

  container.appendChild(img)

  // AI
  predict(img)
  // localPredict(img)
})
