import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {

    const [devices, setDevices] = useState([]);
    const [error, setError] = useState("");
    const [telemetry, setTelemetry] = useState(null);
    const [summary, setSummary]=useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        fetchDevices();
        fetchSummary();
        fetchAlerts();
    }, []);

    // Get devices from backend
    const fetchDevices = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:8080/api/devices",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Devices:", response.data);

            setDevices(response.data);

            // Get telemetry for first device
            if (response.data.length > 0) {
                fetchTelemetry(response.data[0].id);
            }

        } catch (error) {

            console.error("Device API Error:", error);

            setError("Unable to load devices");
        }
    };

    // Get latest telemetry
    const fetchTelemetry = async (deviceId) => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/api/telemetry/device/${deviceId}/latest`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log("Telemetry:", response.data);

            setTelemetry(response.data);

        } catch (error) {

            console.error("Telemetry API Error:", error);

        }
    };
    const fetchSummary=async()=>{
        try{
            const token =localStorage.getItem("token");
            const responce=await axios.get(
                 "http://localhost:8080/api/dashboard/summary",{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                 }
            );
            console.log("Summary:",responce.data);
            setSummary(responce.data);
        }catch(error){
            console.error("Summary API Error:", error);
        }

    };
   const fetchAlerts = async () => {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:8080/api/alerts",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("Alerts:", response.data);

        setAlerts(response.data);

    } catch (error) {

        console.error("Alerts API Error:", error);

    }
};

   return (
    <div className="dashboard">

        <h1>GridWeaver Dashboard</h1>

        {/* Dashboard Summary */}

        <h2>Dashboard Summary</h2>

        {summary && (
            <div className="summary-grid">

                <div className="summary-card">
                    <h3>Total Devices</h3>
                    <p>{summary.totalDevice}</p>
                </div>

                <div className="summary-card">
                    <h3>Online Devices</h3>
                    <p>{summary.onlineDevice}</p>
                </div>

                <div className="summary-card">
                    <h3>Offline Devices</h3>
                    <p>{summary.oflineDevice}</p>
                </div>

                <div className="summary-card">
                    <h3>Maintenance</h3>
                    <p>{summary.maintainceDevice}</p>
                </div>

                <div className="summary-card">
                    <h3>Total Power</h3>
                    <p>{summary.totalPower} W</p>
                </div>

                <div className="summary-card">
                    <h3>Total Energy</h3>
                    <p>{summary.totalEnergy} kWh</p>
                </div>

            </div>
        )}

        {/* Devices */}

        <h2>Devices</h2>

        {error && <p>{error}</p>}

        {devices.length === 0 && !error && (
            <p>Loading devices...</p>
        )}

        <div className="device-grid">

        {devices.map((device) => (

    <div className="device-card" key={device.id}>

        <h3>{device.deviceName}</h3>

        <p>
            Device Type: {device.deviceType}
        </p>

        <p>
            Location: {device.location}
        </p>

        <p className="device-status">
            Status: {device.status}
        </p>

        <button
    type="button"
    onClick={() => {
        console.log("BUTTON CLICKED");
        console.log("Selected device:", device);
        console.log("Device ID:", device.id);

        setSelectedDevice(device);
        fetchTelemetry(device.id);
    }}
>
    View Telemetry
</button>

    </div>

))}

        </div>

        {/* Latest Telemetry */}

        <h2>Latest Telemetry
             {selectedDevice && ` - ${selectedDevice.deviceName}`}
        </h2>

        {telemetry ? (

            <div className="telemetry-grid">

                <div className="telemetry-card">
                    <h3>Voltage</h3>
                    <p>{telemetry.voltage} V</p>
                </div>

                <div className="telemetry-card">
                    <h3>Current</h3>
                    <p>{telemetry.current} A</p>
                </div>

                <div className="telemetry-card">
                    <h3>Power</h3>
                    <p>{telemetry.power} W</p>
                </div>

                <div className="telemetry-card">
                    <h3>Energy</h3>
                    <p>{telemetry.energy} kWh</p>
                </div>

                <div className="telemetry-card">
                    <h3>Temperature</h3>
                    <p>{telemetry.temperature} °C</p>
                </div>

            </div>

        ) : (

            <p>Loading telemetry...</p>

        )}

        {/* Alerts */}
        <h2>Alerts</h2>

        <div className="alert-grid">

    {alerts.length === 0 ? (

        <p>No active alerts</p>

    ) : (

        alerts.map((alert) => (

            <div className="alert-card" key={alert.id}>

                <h3>{alert.alertType}</h3>

                <p>
                    {alert.message}
                </p>

                <p>
                    Device: {alert.device?.deviceName}
                </p>

                <p>
                    Severity: {alert.severity}
                </p>

            </div>

        ))

    )}

    </div>

    </div>
    );
}


export default Dashboard;