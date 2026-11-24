function strip(obj) {
  if (Array.isArray(obj)) return obj.forEach(strip);
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (
        key.startsWith("$") ||
        key.includes(".") ||
        key === "__proto__" ||
        key === "constructor"
      )
        delete obj[key];
      else strip(obj[key]);
    }
  }
}

export const sanitize = (req, _res, next) => {
  strip(req.body);
  strip(req.query);
  next();
};
