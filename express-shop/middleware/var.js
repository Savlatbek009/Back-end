export default function middlewareAS(req, res, next) {
  const isAuth = req.cookies.token ? true : false;
  res.locals.token = isAuth;
  next();
}
