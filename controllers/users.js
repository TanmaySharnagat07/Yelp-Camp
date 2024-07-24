const User = require("../models/user");

module.exports.renderRegForm = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    // if registration is successful automatically log in

    req.login(registeredUser, function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "Registration successful. Welcome to Campgrounds");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "Login Success");
  const redirectUrl = res.locals.returnTo || "/campgrounds";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
