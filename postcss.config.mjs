import ctx from "postcss";

export default {
  plugins: {
    "postcss-import": {},
    "@tailwindcss/postcss": {},
    "postcss-nesting": {},
    ...(ctx.env === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
