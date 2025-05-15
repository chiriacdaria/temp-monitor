# Ventilator Simulator

## Description

This project is a simulator for controlling a fan/thermostat system. It allows users to simulate how a fan responds to temperature changes by adjusting settings and visualizing the behavior in real time.

## Key Features

## Key Features

- **Temperature Simulation:** The temperature is preset between 21.5°C and 22.5°C, simulating a realistic range for the environment.
- **Fan Control:** The fan can be turned ON or OFF by pressing a toggle button. The button dynamically changes the fan’s state. Additionally, if the temperature decreases below the threshold and the button is not pressed, the fan stops automatically.
- **Real-Time Temperature Graph:** A live chart displays temperature changes over time, helping users visualize how temperature fluctuates and how the fan responds.
- **Temperature Table with Alerts:** A table lists recorded temperatures along with alarm and warning statuses, indicating when the temperature exceeds predefined limits.
- **Alarm Log Table:** All alarms triggered during the simulation are recorded in a separate table, allowing users to review past alerts and system behavior.
- **Notifications:** When the maximum temperature limit is exceeded, notifications appear in the bottom-right corner to alert the user immediately.
- **Parameter Configuration:** Users can adjust fan settings, temperature thresholds, and other parameters to customize the simulation.
- **User-Friendly Interface:** The UI is designed to be simple and intuitive, enabling easy control and monitoring of the simulator.

## Database and Cluster

- The application uses **MongoDB** as the database to store temperature records, alarm logs, and configuration parameters.
- Data is stored and retrieved from a **MongoDB Atlas cluster**, providing a secure, scalable, and highly available cloud database solution.
- The cluster configuration ensures data durability and supports concurrent read/write operations necessary for real-time simulation and logging.

## Real-Time Communication with WebSockets

- The simulator uses **WebSockets** to enable real-time, bidirectional communication between the backend server and the frontend client.
- Temperature data, fan status, alarms, and notifications are pushed instantly from the server to the client without the need for manual refreshing.
- This ensures a seamless and dynamic user experience where all changes are reflected immediately on the UI.
- WebSockets also handle real-time control commands from the user 

## Technologies Used

- React (frontend)
- Node.js / NestJS (backend) — if applicable
- Tailwind CSS / Ant Design — for UI styling (if used)

## How to Run

1. Clone the repository:

```bash
git clone https://github.com/username/ventilator-simulator.git
cd ventilator-simulator
```

2. Install dependencies:

```
npm install
```

3. Start the app
   
   - backend:
     ```
     npm run dev
     ```
   - frontend
     ```
     npm run start
     ```
     
4. Open your browser and go to: http://localhost:3000

##Future Improvements

- Support for multiple types of fans or sensors
- Export/import configuration settings
- Set a target temperature from interface


