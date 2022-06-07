let inputs = document.querySelectorAll('form input, form select')
const frmContact = document.getElementById('frmContact');
const modal = document.getElementById('modal')
const btnCloseModal = modal.parentElement.getElementsByClassName('modal__close')[0]
console.log(btnCloseModal)


const validateInput = (toValidate, inputValue, name) => {
  const rules = toValidate.replace(/\s/g,'').split(',');
  const validations = rules.map(rule => rule.split(':'));

  let result = false;
  let message = '';
  validations.some(validation => {
    const [rule, value] = validation
    switch (rule) {
      case 'type': 
        console.log('validating type')
        switch (value) {
          case 'email':
            result = checkEmail(inputValue)
            message = 'Debe ser un correo electrónico.'
            break;
          case 'password':
            result = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/.test(inputValue);
            message = 'Debe tener al menos un número y una letra.'
            break;
          case 'phone':
            result = /^[0-9]{7,}$/.test(inputValue)
            message = 'Debe contener al menos 7 números y sin símbolos o espacios.'
            break;
          case 'number':
            result = !isNaN(inputValue) && !isNaN(parseFloat(inputValue))
            message = 'Debe ser un número.'
            break;
          case 'address': 
            result = /^[a-zA-Z]*\s[0-9]*$/.test(inputValue);
            message = 'Debe contener calle y altura, con un espacio en el medio.'
            break;
          case 'letters':
            result = /^[a-zA-Z\s]*$/.test(inputValue);
            message = 'No son solo letras.'
            break;
        }
        break;
      case 'minlength':
        console.log('validating minlength')
        result = inputValue.trim().length >= value;
        message = 'Debe tener más de '+value+' caracteres.';
        break;
      case 'maxlength':
        console.log('validating maxlength')
        result = inputValue.trim().length <= value;
        break;
      case 'min':
        message = "Debe ser mayor a "+value;
        result = +inputValue > value;
        break;
      case 'max':
        message = "Debe ser menor a "+value;
        result = +inputValue < value;
        break;
      case 'required':
        switch (value) {
          case 'radio':
            message = `El campo ${name} es requerido`
            const radios = frmContact.querySelectorAll(`input[name="${name}"][type="radio"]`)
            result = Array.from(radios).some(radio => radio.checked)
            break;
          case 'checkbox':
            message = `El campo ${name} es requerido`
            const checkboxes = frmContact.querySelectorAll(`input[name="${name}"][type="checkbox"]`)
            result = Array.from(checkboxes).some(checkbox => checkbox.checked)
            break;
          default: 
            message = `El campo es requerido`
            result = inputValue.trim().length > 0
            break;
        }
        
    }

    return !result
  })
  return {
    result,
    message
  };
}

const onShowModal = () => {
  modal.parentElement.classList.remove('hidden')

}

const onCloseModal = () => {
  modal.parentElement.classList.add('hidden')
}

if (modal) {
  modal.querySelector('button.modal__close').addEventListener('click', onCloseModal)
  modal.querySelector('button.modal__btnOK').addEventListener('click', onCloseModal)
}

const setErrorMessageVisibility = (input, value, label, errorDiv, message) => {
  input.classList.toggle('error', value);
  if (label) label.classList.toggle('error', value);
  if (errorDiv) {
    errorDiv.classList.toggle('error--shown', value)
    errorDiv.querySelector('p.errorMessage').textContent = message;
  }
  if (input.type === 'radio') {
    const radios = frmContact.querySelectorAll(`input[name="${input.name}"][type="radio"]`)
    radios.forEach(radio => {
      radio.classList.toggle('error', value);
      const label = radio.parentNode.getElementsByTagName('label')[0];
      radio.parentElement.querySelector('div.error').classList.toggle('error--shown', value)
      label.classList.toggle('error', value);
    })
  }

  if (input.type === 'checkbox') {
    const checkboxes = frmContact.querySelectorAll(`input[name="${input.name}"][type="checkbox"]`)
    checkboxes.forEach(checkbox => {
      checkbox.classList.toggle('error', value);
      const label = checkbox.parentNode.getElementsByTagName('label')[0];
      checkbox.parentElement.querySelector('div.error').classList.toggle('error--shown', value)
      label.classList.toggle('error', value);
    })
  }
};

const onValidate = () => {
  let status = true
  inputs.forEach(input => {
    const errorDiv = input.parentElement.querySelector('div.error');
    const validations = input.dataset.rules;
    const label = input.parentNode.getElementsByTagName('label')[0];
    const res = validateInput(validations, input.value, input.name)
    status = !res.result ? res.result : status;
    if (res.result) {
      setErrorMessageVisibility(input, false, label, errorDiv)
      return;
    }
    setErrorMessageVisibility(input, true, label, errorDiv, res.message)
    console.log('STATUS: ', status)
  })
  return status
}

inputs.forEach(input => {
  const errorDiv = input.parentElement.querySelector('div.error');
  const validations = input.dataset.rules;
  const label = input.parentNode.getElementsByTagName('label')[0];
  const name = input.name;
  if (!validations) return;

  input.addEventListener('blur', e => {
    // const res = validation.test(input.value);
    const res = validateInput(validations, input.value, name)
    if (res.result) {
      setErrorMessageVisibility(input, false, label, errorDiv)
      return;
    }
    setErrorMessageVisibility(input, true, label, errorDiv, res.message)
  })

  input.addEventListener('focus', e => {
    setErrorMessageVisibility(input, false, label, errorDiv)
  })
})

frmContact.addEventListener('submit', e => {
  e.preventDefault();
  const formData = new FormData(e.target)
  const data = {}
  for (const key of formData.keys()) {
    const value = formData.getAll(key)
		data[key] = value.length > 1 ? value : value[0];
	}
  console.log(data)
  console.log(formData.getAll('interest'))
  // inputs.forEach(input => {
  //   input.focus();
  //   input.blur();
  // })
  const result = onValidate()
  if (result) {
    onShowModal()
  }
})

function checkEmail(emailAddress) {
  return /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(emailAddress);
}
