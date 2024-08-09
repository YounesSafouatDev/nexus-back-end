const logSuccessfulLogin = (req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode === 200 && res.body && res.body.message === 'Login successful') {
            console.log(`User ${req.body.email} logged in successfully`);
        }
    });
    next();
};

module.exports = {
    logSuccessfulLogin,
};
