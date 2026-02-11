// Mock data for the NEXUS application

const ROUTES = [
    {
        id: '101',
        name: 'Downtown Loop',
        number: '101',
        color: 'bg-blue-500',
        textColor: 'text-blue-500',
        borderColor: 'border-blue-500',
        type: 'Bus',
        frequency: '10 min',
        stops: [
            { id: 's1', name: 'Central Station', timeOffset: 0 },
            { id: 's2', name: 'Market Square', timeOffset: 5 },
            { id: 's3', name: 'City Library', timeOffset: 12 },
            { id: 's4', name: 'University Hospital', timeOffset: 18 },
            { id: 's5', name: 'Tech Park', timeOffset: 25 },
            { id: 's6', name: 'Riverfront', timeOffset: 32 },
            { id: 's1', name: 'Central Station', timeOffset: 40 } // Loop back
        ]
    },
    {
        id: '202',
        name: 'Westside Express',
        number: '202',
        color: 'bg-emerald-500',
        textColor: 'text-emerald-500',
        borderColor: 'border-emerald-500',
        type: 'Tram',
        frequency: '15 min',
        stops: [
            { id: 's7', name: 'West Terminal', timeOffset: 0 },
            { id: 's8', name: 'Shopping Mall', timeOffset: 8 },
            { id: 's9', name: 'Suburb Center', timeOffset: 16 },
            { id: 's10', name: 'High School', timeOffset: 24 },
            { id: 's1', name: 'Central Station', timeOffset: 35 }
        ]
    },
    {
        id: '305',
        name: 'Airport Shuttle',
        number: '305',
        color: 'bg-purple-500',
        textColor: 'text-purple-500',
        borderColor: 'border-purple-500',
        type: 'Bus',
        frequency: '30 min',
        stops: [
            { id: 's1', name: 'Central Station', timeOffset: 0 },
            { id: 's11', name: 'Hotel District', timeOffset: 10 },
            { id: 's12', name: 'Convention Center', timeOffset: 20 },
            { id: 's13', name: 'Airport T1', timeOffset: 45 },
            { id: 's14', name: 'Airport T2', timeOffset: 50 }
        ]
    }
];

// Initial vehicle positions
const VEHICLES = [
    { id: 'v1', routeId: '101', currentStopIndex: 1, progress: 0.5, status: 'On Time', capacity: 'Medium' },
    { id: 'v2', routeId: '101', currentStopIndex: 4, progress: 0.2, status: 'Delayed', capacity: 'High' },
    { id: 'v3', routeId: '202', currentStopIndex: 2, progress: 0.8, status: 'On Time', capacity: 'Low' },
    { id: 'v4', routeId: '305', currentStopIndex: 1, progress: 0.3, status: 'Early', capacity: 'Medium' }
];

const ALERTS = [
    { id: 'a1', type: 'warning', message: 'Roadworks near Market Square may cause 5-10 min delays.', routeId: '101' },
    { id: 'a2', type: 'info', message: 'New schedule effective from next Monday.', routeId: 'all' }
];

// Helper to simulate live movement
const simulateMovement = (vehicles) => {
    return vehicles.map(v => {
        let newProgress = v.progress + 0.05; // Move forward
        let newIndex = v.currentStopIndex;

        if (newProgress >= 1) {
            newProgress = 0;
            newIndex += 1;
            // Loop for demo purposes, depends on route length
            const route = ROUTES.find(r => r.id === v.routeId);
            if (route && newIndex >= route.stops.length - 1) {
                newIndex = 0;
            }
        }
        return { ...v, currentStopIndex: newIndex, progress: newProgress };
    });
};