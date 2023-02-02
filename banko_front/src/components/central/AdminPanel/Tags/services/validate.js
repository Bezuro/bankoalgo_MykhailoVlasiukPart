function validate(data) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }
    if (!data.name || !data.color) {
        value.message = 'Fields are not filled'
        return value
    }

    if (data.name < 3) {
        value.message = 'Name must contain at least 3 characters'
        return value
    }

    // if color valid

    value.isValid = true

    return value
}

export default validate
