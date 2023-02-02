function validate(data) {
    let value = {
        isValid: false,
        message: '',
    }

    if (!data) {
        value.message = 'Data is empty'
        return value
    }
    if (
        !data.name ||
        !data.minAddedAlgorithms ||
        !data.maxAddedAlgorithms ||
        !data.description
    ) {
        value.message = 'Fields are not filled'
        return value
    }
    if (+data.minAddedAlgorithms < 0) {
        value.message = 'minAddedAlgorithms must be greater than 0'
        return value
    }
    if (+data.maxAddedAlgorithms < 0) {
        value.message = 'maxAddedAlgorithms must be greater than 0'
        return value
    }
    if (+data.maxAddedAlgorithms <= +data.minAddedAlgorithms) {
        value.message =
            'maxAddedAlgorithms must be greater than minAddedAlgorithms'
        return value
    }

    value.isValid = true

    return value
}

export default validate
