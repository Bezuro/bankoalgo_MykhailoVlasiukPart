function validate(data) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }

    value.isValid = true

    return value
}

export default validate
