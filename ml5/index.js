let model
let targetLabel = 'C'
// let trainingData = []
let state = 'collection'

function setup() {
  createCanvas(400, 400)

  const options = {
    inputs: ['x', 'y'],
    outputs: ['label'],
    task: 'classification',
    debug: 'true',
  }
  model = ml5.neuralNetwork(options)
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