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
  try{
    const users = await User.findBy({ username: req.body.username })
    if (users.length) { 
      req.user = users[0]
      next()
    }
    else {
      next({ message: 'Invalid credentials', status: 401 })
    }
  } catch (err) {
    next(err)
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {}

// Don't forget to add these to the `exports` object so they can be required in other modules
module.exports = {
  restricted,
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
}
