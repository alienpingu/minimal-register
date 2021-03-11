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

let dictionary = {
	it: {
		alert: "Compila tutti i campi prima di continuare!",
		input_name: "Nome e Cognome/Azienda",
		help_email: "Email già registrata, provare con un' altra",
		warn_email: "Inserisci una email valida",
		input_phone: "Telefono",
		help_phone: "Telefono già registrato, prova con un altro numero!!",
		help_psw: "La password deve avere almeno una lettera maiuscola, un numero e lunga almeno 8 caratteri.",
		btn_submit: `<span class="iconify" data-icon="mdi:login-variant" data-inline="false"></span>Registrati`,
		after_text: "Grazie per esserti registrato, accedi a tutte le funzioni del seguente software mediante la versione desktop."

	},
	en: {
		alert: "Fill all input befor submit!",
		input_name: "Name Surname / Company",
		help_email: "Email already registered, try another one",
		warn_email: "Insert valid email",
		input_phone: "Phone",
		help_phone: "Phone already registered, try another one",
		help_psw: "The password must contain at least 8 characters, at least one digit and at least one capital letter",
		btn_submit: `<span class="iconify" data-icon="mdi:login-variant" data-inline="false"></span>Register`,
		after_text: "Thank you for registering, access all functions of the following software through the desktop version."
	}
}

var form = document.querySelector("form.form");
var select = document.querySelector('#lang-select');


function handleForm(event) { event.preventDefault(); } 

let Register = (e) => {


    let bool = true;

    let object = state;



    for (let property in object) {
        if (object[property] === null) {
            bool = false
        }
    }

    // Check form

    if (bool) {
    	delete object.validate;
        fetch('https://dev.seasoncycles.com/apiServer/api/data/save', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            })
            .then((response) => response.json())
            .then((data) => {
                console.log('👏 Success')
                form.parentNode.removeChild(form);
                select.parentNode.removeChild(select);
                document.querySelector('#after-form').classList.remove('d-none');
            })
    } else {
        document.querySelector('#alert-form').classList.add('active');
        setTimeout(function(){ 
            document.querySelector('#alert-form').classList.remove('active');
         }, 3000);
        console.log('🛑 Form incompleto ');

    }



}

validateField = (c, v) => {

    let result
    let bkv = v;
    if (c === 'telefono') {
    	v = state.prefix + v;
    }


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

                switch (c) {
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


                            state.validate.email = true;
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

                            state.validate.email = false;
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

                        document.querySelector('#phoneHelp').style.display = 'none';

                        state.validate.phone = true;
                        state.phone = bkv;
                        console.log('📞 Valid - Value: ', state.phone);
                }

            } else {
                switch (c) {

                    case 'email':
                        if (document.querySelector('#emailRegister').classList.contains('valid')) {
                            document.querySelector('#emailRegister').classList.remove('valid');
                        }

                        if (!document.querySelector('#emailRegister').classList.contains('invalid')) {
                            document.querySelector('#emailRegister').classList.add('invalid');
                        }

                        document.querySelector('#emailHelp').style.display = 'block';

                        state.validate.email = false;
                        state.email = null;

                        break;

                    case 'telefono':

                        if (document.querySelector('#telefonoRegister').classList.contains('valid')) {
                            document.querySelector('#telefonoRegister').classList.remove('valid');
                        }

                        if (!document.querySelector('#telefonoRegister').classList.contains('invalid')) {
                            document.querySelector('#telefonoRegister').classList.add('invalid');
                        }

                        document.querySelector('#phoneHelp').style.display = 'block';

                        state.validate.phone = false;
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

        state.validate.password = true;

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

validateSelect = (e) => {
    let select = e.target;
    state.prefix = select.value.split('_')[0];
    state.state = select.value.split('_')[1];
}


validateInput = (input) => (input.value.length > 8) ? input.classList.add('valid') : input.classList.remove('valid');

function isOkPass(p) {
    var anUpperCase = /[A-Z]/;
    var aLowerCase = /[a-z]/;
    var aNumber = /[0-9]/;
    var aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
    var obj = {};
    obj.result = true;

    if (p.length < 7) {
        obj.result = false;
        obj.error = "Not long enough!"
        return obj;
    }

    var numUpper = 0;
    var numLower = 0;
    var numNums = 0;
    var numSpecials = 0;
    for (var i = 0; i < p.length; i++) {
        if (anUpperCase.test(p[i]))
            numUpper++;
        else if (aLowerCase.test(p[i]))
            numLower++;
        else if (aNumber.test(p[i]))
            numNums++;
        else if (aSpecial.test(p[i]))
            numSpecials++;
    }

    if (numUpper < 1 || numLower < 1 || numNums < 1) {
        obj.result = false;
        obj.error = "Wrong Format!";
        return obj;
    }
    return obj;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}


function setLang(lang) {
	switch(lang) {
		case 'en':
			langHandler(dictionary.en)
			break;
		case 'it':
			langHandler(dictionary.it)
			break;

	}
}

function langHandler(dic) {

	document.querySelector('#alert-form').innerText = dic.alert;
	document.querySelector('#NomeRegister').placeholder = dic.input_name;
	document.querySelector('#emailHelp').innerText = dic.help_email;
	document.querySelector('#emailWarn').innerText = dic.warn_email;
	document.querySelector('#telefonoRegister').placeholder = dic.input_phone;
	document.querySelector('#phoneHelp').innerText = dic.help_phone;
	document.querySelector('#psw1Help').innerText = dic.help_psw;
	document.querySelector('#submitBtn').innerHTML = dic.btn_submit;
	document.querySelector('#after-form').innerText = dic.after_text;

	console.log('🍭 Lang Update')

}

window.addEventListener('load', function() {

	setLang('it');

	form.addEventListener('submit', handleForm);

    document.querySelector('#NomeRegister').addEventListener('change', (e) => {
        validateInput(e.target);
        state.name = e.target.value;
    });
    document.querySelector('#emailRegister').addEventListener('change', (e) => validateField('email', e.target.value));
    document.querySelector('#countryReg').addEventListener('change', (e) => {
        validateInput(e.target);
        validateSelect(e);
    });
    document.querySelector('#telefonoRegister').addEventListener('change', (e) => validateField('telefono', e.target.value));
    document.querySelectorAll('#passwordReg1, #passwordReg2').forEach((el) => el.addEventListener('change', () => validatePassword()));
    document.querySelector('#submitBtn').addEventListener('click', (e) => Register(e, state));

    select.addEventListener('change', (e) => setLang(e.target.value));

    console.log('✅ Page loaded');

})