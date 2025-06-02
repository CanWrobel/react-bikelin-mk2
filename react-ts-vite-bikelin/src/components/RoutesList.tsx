import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Route {
    id: string;
    planningData: {
        startString: string;
        endString: string;
        routeDescription: string;
        departureTime: string;
    };
}

interface RouteListProps {
    token: string;
}

const RouteList: React.FC<RouteListProps> = ({ token }) => {
    const [routes, setRoutes] = useState<Route[]>([]);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await axios.get('http://141.45.146.183:8080/route-manager/get-user-routes', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                setRoutes(response.data);  
            } catch (error) {
                console.error('Error fetching routes:', error);
            }
        };

        fetchRoutes();
    }, [token]);  

    const deleteRoute = async (routeId) => {
        try {
            await axios.delete(`http://141.45.146.183:8080/route-manager/delete-route?routeId=${routeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setRoutes(routes.filter(route => route.id !== routeId)); 
            alert('Route successfully deleted!');
        } catch (error) {
            console.error('Error deleting route:', error);
            alert('Failed to delete the route.');
        }
    };
    
    
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        return date.toLocaleString('de-DE', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div>
            <h2>Verwaltete Routen</h2>
            <table>
                <thead>
                    <tr>
                        <th>Startpunkt</th>
                        <th>Zielpunkt</th>
                        <th>Beschreibung</th>
                        <th>Hinzugefügt am</th>
                        <th>Aktionen</th>
                    </tr>
                </thead>
                <tbody>
                    {routes.map(route => (
                        <tr key={route.id}>
                            <td>{route.planningData.startString}</td>
                            <td>{route.planningData.endString}</td>
                            <td>{route.planningData.routeDescription}</td>
                            <td>{formatDate(route.planningData.departureTime)}</td>
                            <td>
                            <button onClick={() => deleteRoute(route.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RouteList;
