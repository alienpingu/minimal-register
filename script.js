let state = {
	name: null,
	email: null,
	prefix: +39,
	phone: null,
	password: null
}


let Register = (opt) => {

	let bool = true;


	for (let key in state) {
	  	if(state[key] === null) {
	  		bool = false;
	  	}
	}


	(bool) ? console.log(state) : console.log('🛑 Form incompleto')
}

window.addEventListener('load', function () {
	console.log('✅ Page loaded');
  	
	document.querySelector('#NomeRegister').addEventListener('change', (e) => state.name = e.target.value);
	document.querySelector('#emailRegister').addEventListener('change', (e) => state.email = e.target.value);
	document.querySelector('#countryReg').addEventListener('change', (e) => state.prefix = e.target.value);
	document.querySelector('#telefonoRegister').addEventListener('change', (e) => state.phone = e.target.value);
	document.querySelector('#passwordReg').addEventListener('change', (e) => state.password = e.target.value);
	document.querySelector('#submitBtn').addEventListener('click', () => Register(state));

	console.log('✅ Async JS loaded');
})