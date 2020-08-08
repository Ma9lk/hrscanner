const getId = (id) => {
	let elId = document.getElementById(id)
	return elId
}

const getClassName = (className) => {
	let elClass = document.querySelectorAll(className)
	return elClass
}


// Выбор тестов для отправки, которые будут показаны
let checkbox = getClassName('.checkbox')
let btnSend = getClassName('.send')
	for (let i=0; i<checkbox.length; i++) {
		checkbox[i].addEventListener('click', function () {
			let checked = this.toggleAttribute('checked')
				btnSend[i].style.display = checked ? 'block' : 'none'
			})
		}




// Input enable/disable
let contacts = getClassName('.submit-form__contact')
let inputWrapper = getClassName('.input-wrapper')
	for (let i=0; i<inputWrapper.length; i++) {
			inputWrapper[i].addEventListener('click', function() {
				for (let c = 0; c < contacts.length; c++) {
					contacts[c].removeAttribute('disabled')
					contacts[c].classList.remove('enable')
				}
			contacts[i].getAttribute('disabled')
			contacts[i].classList.add('enable')
			contacts[i].focus()
			})
		
	}

for (let contact of contacts){
	contact.addEventListener('focusout', function() {
		contact.getAttribute('disabled')
		contact.classList.remove('enable')
		})
	}

// Пвседоэкран
let settingIcon = getId('setting-icon')
let submitForm = document.querySelector('.hrsc-submit-form')
let arrowIcon = getId('arrow-icon')
let setting = getId('setting')
	settingIcon.addEventListener('click', function() {
		submitForm.classList.add('smooz')
		setting.classList.add('smooth')
	})

	arrowIcon.addEventListener('click', function() {
		submitForm.classList.remove('smooz')
		setting.classList.remove('smooth')
	})

// ==========================================================
// Конфетти
// init global elements
const buttons = getClassName('.hrsc-btnn')
var disabled = false
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
let cx = ctx.canvas.width / 2
let cy = ctx.canvas.height / 2

// add Confetto/Sequin objects to arrays to draw them
let confetti = []
let sequins = []

// ammount to add on each button press
const confettiCount = 20
const sequinCount = 10

// "physics" variables
const gravityConfetti = 0.3
const gravitySequins = 0.55
const dragConfetti = 0.075
const dragSequins = 0.02
const terminalVelocity = 3

// colors, back side is darker for confetti flipping
const colors = [
	{ front: '#7b5cff', back: '#6245e0' }, // Purple
	{ front: '#b3c7ff', back: '#8fa5e5' }, // Light Blue
	{ front: '#5c86ff', back: '#345dd1' }  // Darker Blue
]

// helper function to pick a random number within a range
randomRange = (min, max) => Math.random() * (max - min) + min

// helper function to get initial velocities for confetti
// this weighted spread helps the confetti look more realistic
initConfettoVelocity = (xRange, yRange) => {
	const x = randomRange(xRange[0], xRange[1])
	const range = yRange[1] - yRange[0] + 1
	let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range)
	if (y >= yRange[1] - 1) {
		// Occasional confetto goes higher than the max
		y += (Math.random() < .25) ? randomRange(1, 3) : 0
	}
	return { x: x, y: -y }
}

// Confetto Class
function Confetto() {
	this.randomModifier = randomRange(0, 99)
	this.color = colors[Math.floor(randomRange(0, colors.length))]
	this.dimensions = {
		x: randomRange(5, 9),
		y: randomRange(8, 15),
	}
	this.position = {
		x: randomRange(canvas.width / 2 - result.offsetWidth / 4, canvas.width / 2 + result.offsetWidth / 4),
		y: randomRange(canvas.height / 1.5 + result.offsetHeight / 4 + 22, canvas.height / 1.5 + (1.5 * result.offsetHeight) - 4),
		
	}
	this.rotation = randomRange(0, 2 * Math.PI)
	this.scale = {
		x: 1,
		y: 1,
	}
	this.velocity = initConfettoVelocity([-9, 9], [6, 11])
}
Confetto.prototype.update = function () {
	// apply forces to velocity
	this.velocity.x -= this.velocity.x * dragConfetti
	this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity)
	this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random()

	// set position
	this.position.x += this.velocity.x
	this.position.y += this.velocity.y

	// spin confetto by scaling y and set the color, .09 just slows cosine frequency
	this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09)
}

// Sequin Class
	function Sequin() {
		this.color = colors[Math.floor(randomRange(0, colors.length))].back,
			this.radius = randomRange(1, 2),
			this.position = {
				x: randomRange(canvas.width / 2 - result.offsetWidth / 4, canvas.width / 2 + result.offsetWidth / 4),
				y: randomRange(canvas.height / 1.5 + result.offsetHeight / 4 + 22, canvas.height / 1.5 + (1.5 * result.offsetHeight) - 4),
			},
			this.velocity = {
				x: randomRange(-6, 6),
				y: randomRange(-8, -12)
			}
	}
	Sequin.prototype.update = function () {
		// apply forces to velocity
		this.velocity.x -= this.velocity.x * dragSequins
		this.velocity.y = this.velocity.y + gravitySequins

		// set position
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y
	}

// add elements to arrays to be drawn
initBurst = () => {
	for (let i = 0; i < confettiCount; i++) {
		confetti.push(new Confetto())
	}
	for (let i = 0; i < sequinCount; i++) {
		sequins.push(new Sequin())
	}
}

// draws the elements on the canvas
render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	confetti.forEach((confetto, index) => {
		let width = (confetto.dimensions.x * confetto.scale.x)
		let height = (confetto.dimensions.y * confetto.scale.y)

		// move canvas to position and rotate
		ctx.translate(confetto.position.x, confetto.position.y)
		ctx.rotate(confetto.rotation)

		// update confetto "physics" values
		confetto.update()

		// get front or back fill color
		ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back

		// draw confetto
		ctx.fillRect(-width / 2, -height / 2, width, height)

		// reset transform matrix
		ctx.setTransform(1, 0, 0, 1, 0, 0)

		// clear rectangle where button cuts off
		if (confetto.velocity.y < 0) {
			ctx.clearRect(canvas.width / 2 - result.offsetWidth / 2, canvas.height / 2 + result.offsetHeight / 2, result.offsetWidth, result.offsetHeight)
		}
	})

	sequins.forEach((sequin, index) => {
		// move canvas to position
		ctx.translate(sequin.position.x, sequin.position.y)

		// update sequin "physics" values
		sequin.update()

		// set the color
		ctx.fillStyle = sequin.color

		// draw sequin
		ctx.beginPath()
		ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI)
		ctx.fill()

		// reset transform matrix
		ctx.setTransform(1, 0, 0, 1, 0, 0)

		// clear rectangle where button cuts off
		if (sequin.velocity.y < 0) {
			ctx.clearRect(canvas.width / 2 - result.offsetWidth / 2, canvas.height / 2 + result.offsetHeight / 2, result.offsetWidth, result.offsetHeight)
		}
	})

	// remove confetti and sequins that fall off the screen
	// must be done in seperate loops to avoid noticeable flickering
	confetti.forEach((confetto, index) => {
		if (confetto.position.y >= canvas.height) confetti.splice(index, 1)
	})
	sequins.forEach((sequin, index) => {
		if (sequin.position.y >= canvas.height) sequins.splice(index, 1)
	})

	window.requestAnimationFrame(render)
}

// cycle through button states when clicked

// let animationButton = function(elem) {
for (let i=0; i<buttons.length; i++) {
	buttons[i].addEventListener('click', () => {
		if (!disabled) {
			// disabled = true
			// Loading stage
			buttons[i].classList.add('loading')
			buttons[i].classList.remove('hrsc-ready')
			setTimeout(() => {
				// Completed stage
				buttons[i].classList.add('complete')
				buttons[i].classList.remove('loading')
				setTimeout(() => {
					window.initBurst()
					setTimeout(() => {
						// Reset button so user can select it again
						disabled = false
						buttons[i].classList.add('hrsc-ready')
						buttons[i].classList.remove('complete')
					}, 4000)
				}, 320)
			}, 1800)
		}
	})
}

// re-init canvas if the window size changes
resizeCanvas = () => {
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	cx = ctx.canvas.width / 2
	cy = ctx.canvas.height / 2
}

// resize listenter
window.addEventListener('resize', () => {
	resizeCanvas()
})

// click button on spacebar or return keypress
document.body.onkeyup = (e) => {
	if (e.keyCode == 13 || e.keyCode == 32) {
		clickButton()
	}
}

// Set up button text transition timings on page load

let textElements = document.querySelectorAll('.button-text')
	textElements.forEach((element) => {
		characters = element.innerText.split('')
		let characterHTML = ''
		characters.forEach((letter, index) => {
			characterHTML += `<span class="char${index}" style="--d:${index * 30}ms; --dr:${(characters.length - index - 1) * 30}ms;">${letter}</span>`
		})
		element.innerHTML = characterHTML
	})



// kick off the render loop
render()
