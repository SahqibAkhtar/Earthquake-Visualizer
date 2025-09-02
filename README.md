# React + Vite

🌍 Earthquake Visualizer

A web application built with React + Leaflet to visualize global earthquake data in real time. Users can explore recent earthquakes, filter by magnitude, toggle heatmaps, switch between light/dark mode, search locations, and even export earthquake data as CSV.

🚀 Features

📊 Real-time Earthquake Data
⦁	Fetches live data from the USGS Earthquake API
⦁	Filters by magnitude and time period (hour, day, week)


🎨 Dark Mode
⦁	Switch between light and dark UI themes (applies to the map and UI elements)


🔥 Heatmap Visualization
⦁	Toggle a heatmap overlay to spot earthquake intensity hotspots

📍 Search Location
⦁	Search for a place using the Geoapify Geocoding API
⦁	Automatically zooms to the searched location

🎬 Timeline Playback
⦁	Play through earthquake events in chronological order

📑 Export Data
⦁	Download earthquake data as a CSV file for offline use

🖥️ Responsive Design
⦁	Works on desktop, tablet, and mobile devices

______________________________________________________________________________________________

🛠️ Tech Stack
⦁	Frontend: React, Vite
⦁	Maps & Visualization: Leaflet, React-Leaflet
⦁	APIs:
        USGS Earthquake API
        Geoapify Geocoding API

⦁	Styling: CSS (with dark mode support)

________________________________________________________________________________________________



📦 Installation

Clone the repository and install dependencies:

git clone https://github.com/your-username/Earthquake-Visualizer.git
cd Earthquake-Visualizer
npm install

⚙️ Environment Variables

Create a .env file in the root of your project with your Geoapify API key:

VITE_GEOAPIFY_KEY=your_api_key_here

You can obtain a free API key from Geoapify

_________________________________________________________________________________________

▶️ Running the Project

Start the development server:
npm run dev


Build for production:
npm run build


Preview the build:
npm run preview

_________________________________________________________________________________________--

🌐 Deployment

The app can be deployed to GitHub Pages, Vercel, or Netlify.
Example for GitHub Pages:

npm run deploy


📸 Screenshots



__________________________________________________________________________________________-
🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to fork the project and submit a PR.

📜 License

This project is licensed under the MIT License – see the LICENSE
 file for details.

✨ Built with ❤️ using React & Leaflet


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
