function validate(data, selectedTags) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }
    if (!data.name || selectedTags.length <= 0) {
        value.message = 'Fields are not filled'
        return value
    }

    value.isValid = true

    return value
}

export default validate
