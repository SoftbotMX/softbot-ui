import ctx from "postcss";

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    "postcss-import": {},
    "postcss-nesting": {},
    ...(ctx.env === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
