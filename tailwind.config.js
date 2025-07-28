/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  // "content" define en qué archivos Tailwind tiene
  // que buscar las clases que usamos.
  // Esto es requerido porque Tailwind crea un CSS
  // solo con las clases que se estén realmente usando.
  content: [
    "./index.html",
    "./src/**/*.{vue,js,jsx,ts,tsx}",
  ],
  // "theme" nos permite configurar los estilos que queremos que
  // Tailwind provea como clases.
  theme: {
    // "extend" permite agregar nuevos valores a un estilo sin
    // remover los defaults de Tailwind.
    extend: {
      // Las claves son los nombres de los estilos a los que queremos
      // agregarles valores.
      gridTemplateRows: {
        'layout': '64px 1fr 100px',
      }
    },
  },
  plugins: [],
}
