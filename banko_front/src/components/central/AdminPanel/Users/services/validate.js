import { validateEmail } from '../../../../../utils/utils'

function validate(data) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }
    if (!data.email || !data.nickname) {
        value.message = 'Fields are not filled'
        return value
    }
    if (data.nickname.length < 3) {
        value.message = 'Nickname must be at least 3 characters long'
        return value
    }

    if (!validateEmail(data.email)) {
        value.message = 'Email is not valid'
        return value
    }

    value.isValid = true

    return value
}

export default validate
