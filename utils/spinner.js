const ora = require('ora')

exports.waitFnLoading = (fn, message) => async (...args) => {
    const spinner = ora(message)
    spinner.start()
    const result = await fn(...args)
    spinner.stop()
    return result
};
