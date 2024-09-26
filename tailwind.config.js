import { withUt } from "uploadthing/tw";
 
export default withUt({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '320px',
        'xl': '1280px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

      'Yellow-Green':'#AAD15F',
      'Orange(Pantone)': '#FF670E',
      'Chocolate-cosmos': '#4E070C',
      'Sinopia':'#D22701',
      'Almond': '#FDE4CE',
      
      'Electric-purple':'#BF00FF',
      'Mauveine':'#7900A2',
      'Reseda-green':'#5F6F52',
      'penn-red':'#990000',
      'Dartmouth-green':'#065E0C',
      'rosey-brown':'#CC9A86',
      'Kobicha':'#673d26',
      'Cream':'#FDFBCE',
      'Fern_green':'#5A804D',
      'Lime':'#CCF551',
      'Buff':'#dfaf90'
      },
    },
  },
  plugins: [],
});