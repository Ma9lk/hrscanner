const btns = document.getElementsByClassName("btn")
for (const btn of btns) {
	btn.addEventListener('click', function () {
		btn.classList.toggle('active')
	})
}

const pencil = document.getElementById("img")
	pencil.addEventListener('click', function () {
		document.getElementById("infoCandidate").disabled = false
	})

const reload = document.getElementById("reboot")
	reload.addEventListener('click', function () {
		window.location.reload()
	})