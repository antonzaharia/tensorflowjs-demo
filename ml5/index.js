let model
let targetLabel = 'C'
// let trainingData = []
let state = 'collection'

function setup() {
  createCanvas(400, 400)
  background(255)

  const options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
  }
  model = ml5.neuralNetwork(options)
  model.loadData('mouse-notes.json', dataLoaded)
  const modelInfo = {
    model: 'model/model.json',
    metadata: 'model/model_meta.json',
    weights: 'model/model.weights.bin',
  }
  model.load(modelInfo, modelLoaded)
}
function modelLoaded() {
  console.log('model loaded.')
  state = 'prediction'
}
function dataLoaded() {
  console.log(model.data.data)

  // for (let i = 0; i < data.length; i++) {
  //   stroke(0)
  //   noFill()
  //   ellipse(inputs.x, inputs.y, 24)
  //   fill(0)
  //   noStroke()
  //   textAlign(CENTER, CENTER)
  //   text(target.label, inputs.x, inputs.y)
  // }
}

function keyPressed() {
  if (key == 't') {
    state = 'training'
    console.log('start training')
    model.normalizeData()
    let options = {
      epochs: 200,
    }
    model.train(options, whileTraining, finishedTraining)
  } else if (key == 's') {
    model.saveData('mouse-notes')
  } else if (key == 'm') {
    model.save('model')
  } else {
    targetLabel = key.toUpperCase()
  }
}

function whileTraining(epoch, loss) {
  console.log(epoch)
  console.log(loss)
}

function finishedTraining() {
  console.log('finished training.')
  state = 'prediction'
}

function mousePressed() {
  let inputs = {
    x: mouseX,
    y: mouseY,
  }
  if (state === 'collection') {
    let target = {
      label: targetLabel,
    }
    model.addData(inputs, target)
    stroke(0)
    noFill()
    ellipse(mouseX, mouseY, 24)
    fill(0)
    noStroke()
    textAlign(CENTER, CENTER)
    text(targetLabel, mouseX, mouseY)
  } else if (state === 'prediction') {
    model.classify(inputs, gotResults)
  }
}

function gotResults(error, results) {
  if (error) {
    console.error(error)
    return
  }
  stroke(0)
  fill(0, 0, 255, 100)
  ellipse(mouseX, mouseY, 24)
  fill(0)
  noStroke()
  textAlign(CENTER, CENTER)
  text(results[0].label, mouseX, mouseY)
}
