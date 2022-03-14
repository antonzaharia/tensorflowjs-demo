//  THis is the model
// https://www.youtube.com/watch?v=iUiOx2fBx18&t=0s
const model = tf.sequential()

// Create the hidden layer
//  dense is a 'fully connected layer'
const hidden = tf.layers.dense({
  units: 4, // number of nodes
  inputShape: [2], // input shape
  activation: 'sigmoid',
})
// Add the layer
model.add(hidden)

// Create the output layer
const output = tf.layers.dense({
  units: 1,
  // input shape is inferred from the previous layer
  activation: 'sigmoid',
})
model.add(output)

// An optimizer using gradient descent
const sgdOpt = tf.train.sgd(0.5)

// Compiling the model
model.compile({
  optimizer: sgdOpt,
  loss: tf.losses.meanSquaredError,
})

const xs = tf.tensor2d([
  [0, 0],
  [0.5, 0.5],
  [1, 1],
])

const ys = tf.tensor2d([[1], [0.5], [0]])

train().then(() => {
  console.log('Training complete.')
  let outputs = model.predict(xs)
  outputs.print()
})

async function train() {
  for (let i = 0; i < 1000; i++) {
    const response = await model.fit(xs, ys, {
      shuffle: true,
      epochs: 10,
    })
    console.log(response.history.loss[0])
  }
}

// Draw

function drawTensor() {
  const values = []
  for (let i = 0; i < 15; i++) {
    values[i] = Math.random(0) * 100
  }
  const shape = [5, 3]
  tf.tidy(() => {
    const a = tf.tensor2d(values, shape, 'int32')
    const b = tf.tensor2d(values, shape, 'int32')
    const b_t = b.transpose()
    const c = a.matMul(b_t)
  })
  console.log('now')
}
