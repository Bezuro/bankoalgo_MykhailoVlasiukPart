function validate(data) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }
    if (!data.name || !data.showNumber) {
        value.message = 'Fields are not filled'
        return value
    }
    if (+data.showNumber < -1) {
        value.message = 'showNumber must be greater or equal to -1'
        return value
    }

    value.isValid = true

    return value
}

export default validate
