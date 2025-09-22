import ctx from "postcss";

export default {
  plugins: {
    "postcss-import": {},
    "postcss-nesting": {},
    autoprefixer: {},
    ...(ctx.env === "production" ? { cssnano: { preset: "default" } } : {}),
  },
};
