const User = require('../users/users-model')

const restricted = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    next({
      status: 401,
      message: 'You shall not pass!',
    })
  }
}

const checkUsernameFree = async (req, res, next) => {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (!users.length) {
      next()
    } else {
      next({
        status: 422,
        message: 'Username taken',
      })
    }
  } catch (err) {
    next(err)
  }
}

const checkUsernameExists = async (req, res, next) => {
  try {
    const users = await User.findBy({ username: req.body.username })
    if (users.length) {
      req.user = users[0]
      next()
    } else {
      next({
        status: 401,
        message: 'Invalid credentials',
      })
    }
  } catch (err) {
    next(err)
  }
}

const checkPasswordLength = (req, res, next) => {
  if (!req.body.password || req.body.password.length < 3) {
    next({
      status: 422,
      message: 'Password must be longer than 3 chars',
    })
  } else {
    next()
  }
}

module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
}
