const container = document.getElementById('container')
const readURL = (file) => {
  return new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload = (e) => res(e.target.result)
    reader.onerror = (e) => rej(e)
    reader.readAsDataURL(file)
  })
}

const buildBox = (prediction) => {
  console.log(prediction)
  let box = document.createElement('div')
  box.setAttribute('class', 'box')

  box.style.left = `${prediction.bbox[0]}px`
  box.style.top = `${prediction.bbox[1]}px`
  box.style.width = `${prediction.bbox[2]}px`
  box.style.height = `${prediction.bbox[3]}px`

  let bar = document.createElement('div')
  bar.setAttribute('class', 'bar')

  let name = document.createElement('span')
  let prob = document.createElement('span')

  name.innerText = prediction.class
  prob.innerText = `${parseInt(prediction.score * 100)}% sure`

  bar.appendChild(name)
  bar.appendChild(prob)
  box.appendChild(bar)

  container.appendChild(box)
}

const imageInput = document.getElementById('image-input')

imageInput.addEventListener('change', async (e) => {
  e.preventDefault()
  document.querySelectorAll('.box').forEach((e) => e.remove())
  img = document.getElementById('img')

  const url = await readURL(e.target.files[0])
  img.setAttribute('src', url)

  container.appendChild(img)

  // AI
  cocoSsd.load().then((model) => {
    model.detect(img).then((predictions) => {
      console.log('Predictions: ', predictions)
      predictions.map(buildBox)
    })
  })
})
