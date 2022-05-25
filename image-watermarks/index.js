let state = 'no_watermark'

let img = document.getElementById('img')
const container = document.getElementById('container')
const stateElement = document.getElementById('state')
stateElement.innerHTML = 'Upload No watermark images'

const featureExtractor = ml5.featureExtractor('MobileNet', modelLoaded)
const classifier = featureExtractor.classification(imageLoaded)

document.getElementById('image-input').addEventListener('change', async (event) => {
  event.preventDefault()
  if (state === 'no_watermark') {
    await addImagesToModel(event, 'no_watermark')
    state = 'watermark'
    stateElement.innerHTML = 'Upload watermark images'
  } else if (state === 'watermark') {
    await addImagesToModel(event, 'watermark')
    featureExtractor.train(whileTraining)
  } else if (state === 'predict') {
    const url = await readURL(event.target.files[0])
    img.setAttribute('src', url)
    container.appendChild(img)

    classifier.classify(document.getElementById('img')).then((result) => {
      console.log('Label: ', result[0].label)
      console.log('Confidence: ', result[0].confidence * 10)
    })
  }
})

function modelLoaded() {
  console.log('Model Loaded!')
}
function imageLoaded() {
  console.log('Image loaded.')
}
function uploadImage() {
  console.log('1 image uploaded')
}
function whileTraining(loss) {
  if (loss) {
    console.log(loss)
  } else {
    state = 'predict'
    stateElement.innerHTML = 'Test Images'
    console.log('Training complete.')
  }
}

const addImagesToModel = async (event, label) => {
  console.log(event.target.files.length)
  for (let i = 0; i < event.target.files.length; i++) {
    const url = await readURL(event.target.files[i])
    img.setAttribute('src', url)
    container.appendChild(img)
    classifier.addImage(document.getElementById('img'), label, () => console.log(`${i + 1}. ${label} images added`))
  }
}

const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e) => res(e.target.result)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })
}
