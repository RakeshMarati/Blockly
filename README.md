# Vehicle Tracker App

A real-time vehicle tracking application built with React and Leaflet that simulates a vehicle moving along a predefined route on an interactive map.

## 🚗 Features

- **Interactive Map**: OpenStreetMap integration with React-Leaflet
- **Real-time Simulation**: Vehicle marker moves along a predefined route
- **Route Visualization**: 
  - Gray dashed line for the full planned route
  - Red solid line for the traveled path
- **Live Telemetry**: 
  - Current GPS coordinates
  - Timestamp display
  - Speed calculation (km/h)
  - Route progress percentage
- **Control Panel**: Play/Pause and Reset functionality
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 19 with functional components and hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: React-Leaflet + Leaflet (OpenStreetMap)
- **Data**: Static JSON file with GPS coordinates

## 🚀 Live Demo

Visit: [https://blockly-nu-woad.vercel.app/](https://blockly-nu-woad.vercel.app/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RakeshMarati/Blockly.git
   cd Blockly
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
Blockly/
├── public/
│   └── dummy-route.json          # GPS coordinates data
├── src/
│   ├── components/
│   │   └── VehicleMap.jsx        # Main map component
│   ├── utils/
│   │   └── geo.js               # Distance & speed calculations
│   ├── App.jsx                   # Root component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles
├── package.json
└── README.md
```

## 🗺️ Route Data Format

The app uses `public/dummy-route.json` with GPS coordinates:

```json
[
  {
    "latitude": 17.385044,
    "longitude": 78.486671,
    "timestamp": "2024-07-20T10:00:00Z"
  }
]
```

## ⚙️ Configuration

- **Map Center**: Hyderabad, India (17.385044, 78.486671)
- **Update Interval**: 2 seconds
- **Route Points**: 20 GPS coordinates
- **Speed Calculation**: Haversine formula

## 🎮 Usage

1. **Start Simulation**: Click the green "Play" button
2. **Pause**: Click the red "Pause" button
3. **Reset**: Click "Reset" to return to start
4. **View Telemetry**: Monitor coordinates, time, speed, and progress

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy with default Vercel settings
3. Framework: Vite, Build Command: `npm run build`, Output: `dist`

### Other Platforms
- **Netlify**: Connect GitHub repo, build command: `npm run build`
- **GitHub Pages**: Use GitHub Actions with Vite build
- **Firebase Hosting**: Deploy the `dist/` folder

## 🔧 Customization

- **Change Route**: Modify `public/dummy-route.json`
- **Update Speed**: Change interval in `VehicleMap.jsx` (line 45)
- **Styling**: Edit Tailwind classes in components
- **Map Style**: Switch to different tile providers in `VehicleMap.jsx`

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop browsers
- Mobile browsers
- Tablet devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Rakesh Kumar Marati**
- GitHub: [@RakeshMarati](https://github.com/RakeshMarati)

## 🙏 Acknowledgments

- OpenStreetMap contributors for map tiles
- React-Leaflet for map integration
- Tailwind CSS for styling
- Vite for build tooling
