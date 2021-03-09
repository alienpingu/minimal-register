

let state = {
	name: null,
	email: null,
	prefix: +39,
	state: 'it',
	phone: 39,
	password: null,
	validate: {
		email: false,
		phone: false,
		password: false
	}
}


let Register = (e) => {


	let bool = true;

	let object = state;

	delete object.validate;


	for (let property in object) {
		if(object[property] === null) {
			bool = false
		}
	}

// Check form
	
	if (bool) {
		// post(`https://dev.seasoncycles.com/apiServer/api/data/save?name=${state.name}&email=${state.email}&prefix=${state.prefix}&state=${state.state}&phone=${state.phone}&password=${state.password}`)
		fetch('https://dev.seasoncycles.com/apiServer/api/data/save',{ 
				method: 'POST',
			 	headers: {
			      'Accept': 'application/json',
			      'Content-Type': 'application/json'
			    },
				body: JSON.stringify(object)
		}
		)
		.then((response) => response.json())
		.then((data) => {
			console.log('🛠 Response: ', data)
		})
	} else {
		document.querySelector('#alert-form').classList.add('active');
		console.log('🛑 Form incompleto ');

	}


	
}

validateField = (c, v) => {

	let result


	fetch(`https://dev.seasoncycles.com/apiServer/api/data/validate?campo=${c}&valore=${v}`, {
	  method: 'POST',
	   headers: {
	    'Content-Type': 'application/json',
	  }
	})
	.then((response) => response.json())
	.then((data) => {

		console.log('🛠 Response: ', data);

		result = data



		if (result === 0 && v !== '' && v !== undefined) {

			switch(c) {
				case 'email':

					let emailValidity = validateEmail(v);

					if (emailValidity) {
						if (!document.querySelector('#emailRegister').classList.contains('valid')) {
							document.querySelector('#emailRegister').classList.add('valid');
						}
						if (document.querySelector('#emailRegister').classList.contains('invalid')) {
							document.querySelector('#emailRegister').classList.remove('invalid');
						}

						document.querySelector('#emailWarn').style.display = 'none';

						document.querySelector('#emailHelp').style.display = 'none';


						state.validate.email =  true;
						state.email = v;
						console.log('📧 Valid - Value: ', state.email);
					} else {
						if (document.querySelector('#emailRegister').classList.contains('valid')) {
						document.querySelector('#emailRegister').classList.remove('valid');
						}

						if (!document.querySelector('#emailRegister').classList.contains('invalid')) {
							document.querySelector('#emailRegister').classList.add('invalid');
						}
						document.querySelector('#emailWarn').style.display = 'block';

						state.validate.email =  false;
						state.email = null;
					}

					break;
				case 'telefono':
					if (document.querySelector('#telefonoRegister').classList.contains('invalid')) {
						document.querySelector('#telefonoRegister').classList.remove('invalid');
					}

					if (!document.querySelector('#telefonoRegister').classList.contains('valid')) {
						document.querySelector('#telefonoRegister').classList.add('valid');
					}

					state.validate.phone =  true;
					state.phone = v;
					console.log('📞 Valid - Value: ', state.phone);
			}

		} else {
			switch(c) {
				case 'email':
					if (document.querySelector('#emailRegister').classList.contains('valid')) {
						document.querySelector('#emailRegister').classList.remove('valid');
					}

					if (!document.querySelector('#emailRegister').classList.contains('invalid')) {
						document.querySelector('#emailRegister').classList.add('invalid');
					}

					document.querySelector('#emailHelp').style.display = 'block';

					state.validate.email =  false;
					state.email = null;

					break;
				case 'telefono':
					if (document.querySelector('#telefonoRegister').classList.contains('valid')) {
						document.querySelector('#telefonoRegister').classList.remove('valid');
					}

					if (!document.querySelector('#telefonoRegister').classList.contains('invalid')) {
						document.querySelector('#telefonoRegister').classList.add('invalid');
					}

					state.validate.phone =  false;
					state.phone = null;
					break;
			}
		}
		
	})



	return result;
}



validatePassword = () => {
	
	let psw1 = document.querySelector('#passwordReg1').value;


	let complex = isOkPass(psw1);

	if (complex.result && psw1 !== '' && psw1 !== undefined) {
		if (document.querySelector('#passwordReg1').classList.contains('invalid')) {
			document.querySelector('#passwordReg1').classList.remove('invalid');
		}

		if (!document.querySelector('#passwordReg1').classList.contains('valid')) {
			document.querySelector('#passwordReg1').classList.add('valid');
		}


		document.querySelector('#psw1Help').style.display = 'none';

		state.password = hex_sha512(psw1);

		state.validate.password =  true;

		console.log('🔐 Valid - ', [state.password, psw1]);

	} else {
		if (document.querySelector('#passwordReg1').classList.contains('valid')) {
			document.querySelector('#passwordReg1').classList.remove('valid');
		}

		if (!document.querySelector('#passwordReg1').classList.contains('invalid')) {
			document.querySelector('#passwordReg1').classList.add('invalid');
		}

		document.querySelector('#psw1Help').style.display = 'block';

		state.password = null;
		state.validate.password = false;

		console.log('🔏 Invalid - ', complex.error)
	}

}

validateInput = (input) => (input.value.length > 8) ? input.classList.add('valid') : input.classList.remove('valid');

function isOkPass(p){
    var anUpperCase = /[A-Z]/;
    var aLowerCase = /[a-z]/; 
    var aNumber = /[0-9]/;
    var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
    var obj = {};
    obj.result = true;

    if(p.length < 7){
        obj.result=false;
        obj.error="Not long enough!"
        return obj;
    }

    var numUpper = 0;
    var numLower = 0;
    var numNums = 0;
    var numSpecials = 0;
    for(var i=0; i<p.length; i++){
        if(anUpperCase.test(p[i]))
            numUpper++;
        else if(aLowerCase.test(p[i]))
            numLower++;
        else if(aNumber.test(p[i]))
            numNums++;
        else if(aSpecial.test(p[i]))
            numSpecials++;
    }

    if(numUpper < 1 || numLower < 1 || numNums < 1){
        obj.result=false;
        obj.error="Wrong Format!";
        return obj;
    }
    return obj;
}

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

window.addEventListener('load', function () {
  	
	document.querySelector('#NomeRegister').addEventListener('change', (e) => {
		validateInput(e.target);
		state.name = e.target.value;
	});
	document.querySelector('#emailRegister').addEventListener('change', (e) => validateField('email', e.target.value));
	document.querySelector('#countryReg').addEventListener('change', (e) => {
		validateInput(e.target);
		state.prefix = e.target.value;
	});
	document.querySelector('#telefonoRegister').addEventListener('change', (e) => validateField('telefono', e.target.value));
	document.querySelectorAll('#passwordReg1, #passwordReg2').forEach((el) => el.addEventListener('change', () => validatePassword()));
	document.querySelector('#submitBtn').addEventListener('click', (e) => Register(e, state));

	console.log('✅ Page loaded');

})