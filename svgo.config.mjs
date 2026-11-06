// Formata e otimiza SVGs. O preset padrão do svgo 4 já preserva o `viewBox`.
export default {
  multipass: true,
  js2svg: { pretty: true, indent: 2 },
  plugins: ["preset-default"],
};
