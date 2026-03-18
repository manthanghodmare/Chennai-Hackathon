// Mock data for the NEXUS application — organised by city

const CITY_DATA = {
    chennai: {
        name: 'Chennai',
        mapCenter: [13.0827, 80.2707],
        mapZoom: 12,
        operator: 'MTC – Metropolitan Transport Corporation',
        routes: [
            {
                id: '12B',
                name: 'Koyambedu – Tambaram',
                number: '12B',
                color: 'bg-blue-500',
                textColor: 'text-blue-500',
                borderColor: 'border-blue-500',
                type: 'Bus',
                frequency: '8 min',
                pathPoints: [ {x:200, y:100}, {x:400, y:200}, {x:600, y:300}, {x:700, y:400}, {x:800, y:450}, {x:900, y:500} ],
                stops: [
                    { id: 's1', name: 'Koyambedu Bus Terminus', timeOffset: 0, waitingCount: 38 },
                    { id: 's2', name: 'Anna Nagar Tower', timeOffset: 5, waitingCount: 12 },
                    { id: 's3', name: 'Vadapalani Signal', timeOffset: 10, waitingCount: 27 },
                    { id: 's4', name: 'Ashok Nagar', timeOffset: 16, waitingCount: 5 },
                    { id: 's5', name: 'Chrompet Junction', timeOffset: 24, waitingCount: 42 },
                    { id: 's6', name: 'Tambaram Sanatorium', timeOffset: 32, waitingCount: 19 }
                ]
            },
            {
                id: '27C',
                name: 'Broadway – Thiruvanmiyur',
                number: '27C',
                color: 'bg-emerald-500',
                textColor: 'text-emerald-500',
                borderColor: 'border-emerald-500',
                type: 'Bus',
                frequency: '12 min',
                pathPoints: [ {x:800, y:100}, {x:850, y:200}, {x:850, y:300}, {x:900, y:400}, {x:950, y:550} ],
                stops: [
                    { id: 's7', name: 'Broadway Bus Terminus', timeOffset: 0, waitingCount: 31 },
                    { id: 's8', name: 'Parry\'s Corner', timeOffset: 4, waitingCount: 8 },
                    { id: 's9', name: 'Adyar Signal', timeOffset: 12, waitingCount: 22 },
                    { id: 's10', name: 'Tidel Park', timeOffset: 18, waitingCount: 44 },
                    { id: 's11', name: 'Thiruvanmiyur', timeOffset: 25, waitingCount: 15 }
                ]
            },
            {
                id: '47D',
                name: 'Chennai Central – Kelambakkam',
                number: '47D',
                color: 'bg-purple-500',
                textColor: 'text-purple-500',
                borderColor: 'border-purple-500',
                type: 'Bus',
                frequency: '20 min',
                pathPoints: [ {x:750, y:150}, {x:600, y:250}, {x:700, y:400}, {x:700, y:500}, {x:650, y:580} ],
                stops: [
                    { id: 's12', name: 'Chennai Central', timeOffset: 0, waitingCount: 36 },
                    { id: 's13', name: 'T.Nagar Panagal Park', timeOffset: 7, waitingCount: 14 },
                    { id: 's14', name: 'Velachery', timeOffset: 18, waitingCount: 29 },
                    { id: 's15', name: 'Sholinganallur', timeOffset: 26, waitingCount: 7 },
                    { id: 's16', name: 'Kelambakkam', timeOffset: 35, waitingCount: 21 }
                ]
            }
        ],
        vehicles: [
            { id: 'v1', routeId: '12B', currentStopIndex: 1, progress: 0.5, status: 'On Time', capacity: 'High' },
            { id: 'v2', routeId: '12B', currentStopIndex: 3, progress: 0.2, status: 'Delayed', capacity: 'High' },
            { id: 'v3', routeId: '27C', currentStopIndex: 2, progress: 0.7, status: 'On Time', capacity: 'Medium' },
            { id: 'v4', routeId: '47D', currentStopIndex: 1, progress: 0.4, status: 'On Time', capacity: 'Low' }
        ],
        alerts: [
            { id: 'a1', type: 'warning', message: 'Roadworks near Anna Nagar signal may cause 5–10 min delays on Route 12B.', routeId: '12B' },
            { id: 'a2', type: 'info', message: 'MTC summer schedule effective from April 1. Route 47D frequency increased.', routeId: 'all' }
        ]
    },

    mumbai: {
        name: 'Mumbai',
        mapCenter: [19.0760, 72.8777],
        mapZoom: 11,
        operator: 'BEST – Brihanmumbai Electric Supply & Transport',
        routes: [
            {
                id: '340',
                name: 'Chhatrapati Shivaji – Bandra',
                number: '340',
                color: 'bg-red-500',
                textColor: 'text-red-500',
                borderColor: 'border-red-500',
                type: 'Bus',
                frequency: '5 min',
                pathPoints: [ {x:300, y:500}, {x:250, y:400}, {x:200, y:300}, {x:150, y:200}, {x:250, y:100} ],
                stops: [
                    { id: 's1', name: 'CST Bus Depot', timeOffset: 0, waitingCount: 40 },
                    { id: 's2', name: 'Churchgate', timeOffset: 6, waitingCount: 33 },
                    { id: 's3', name: 'Haji Ali', timeOffset: 13, waitingCount: 18 },
                    { id: 's4', name: 'Worli Sea Face', timeOffset: 19, waitingCount: 9 },
                    { id: 's5', name: 'Bandra Station', timeOffset: 27, waitingCount: 44 }
                ]
            },
            {
                id: '506',
                name: 'Borivali – Andheri',
                number: '506',
                color: 'bg-orange-500',
                textColor: 'text-orange-500',
                borderColor: 'border-orange-500',
                type: 'Bus',
                frequency: '10 min',
                pathPoints: [ {x:100, y:50}, {x:150, y:150}, {x:200, y:250}, {x:200, y:350}, {x:250, y:450} ],
                stops: [
                    { id: 's6', name: 'Borivali Station (W)', timeOffset: 0, waitingCount: 22 },
                    { id: 's7', name: 'Dahisar', timeOffset: 8, waitingCount: 11 },
                    { id: 's8', name: 'Kandivali', timeOffset: 14, waitingCount: 35 },
                    { id: 's9', name: 'Malad', timeOffset: 19, waitingCount: 28 },
                    { id: 's10', name: 'Andheri Station', timeOffset: 26, waitingCount: 43 }
                ]
            },
            {
                id: '703',
                name: 'Kurla – Thane',
                number: '703',
                color: 'bg-sky-500',
                textColor: 'text-sky-500',
                borderColor: 'border-sky-500',
                type: 'Bus',
                frequency: '15 min',
                pathPoints: [ {x:500, y:300}, {x:600, y:250}, {x:700, y:200}, {x:800, y:150} ],
                stops: [
                    { id: 's11', name: 'Kurla Bus Terminal', timeOffset: 0, waitingCount: 17 },
                    { id: 's12', name: 'Ghatkopar', timeOffset: 9, waitingCount: 30 },
                    { id: 's13', name: 'Mulund Check Naka', timeOffset: 18, waitingCount: 6 },
                    { id: 's14', name: 'Thane Station', timeOffset: 28, waitingCount: 38 }
                ]
            },
            {
                id: 'A1',
                name: 'Airport T1 – Colaba',
                number: 'A-1',
                color: 'bg-indigo-600',
                textColor: 'text-indigo-600',
                borderColor: 'border-indigo-600',
                type: 'AC Bus',
                frequency: '20 min',
                pathPoints: [ {x:100, y:100}, {x:200, y:200}, {x:300, y:300}, {x:400, y:400} ],
                stops: [
                    { id: 'sa1', name: 'Domestic Airport T1', timeOffset: 0, waitingCount: 55 },
                    { id: 'sa2', name: 'Santacruz', timeOffset: 8, waitingCount: 12 },
                    { id: 'sa3', name: 'Mahim', timeOffset: 18, waitingCount: 22 },
                    { id: 'sa4', name: 'Colaba Causeway', timeOffset: 35, waitingCount: 41 }
                ]
            },
            {
                id: '123',
                name: 'Vashi – Gateway of India',
                number: '123',
                color: 'bg-emerald-600',
                textColor: 'text-emerald-600',
                borderColor: 'border-emerald-600',
                type: 'Bus',
                frequency: '30 min',
                pathPoints: [ {x:700, y:500}, {x:600, y:400}, {x:500, y:300}, {x:400, y:200} ],
                stops: [
                    { id: 'sv1', name: 'Vashi Sector 17', timeOffset: 0, waitingCount: 15 },
                    { id: 'sv2', name: 'Mankhurd', timeOffset: 12, waitingCount: 28 },
                    { id: 'sv3', name: 'Chembur Naka', timeOffset: 20, waitingCount: 19 },
                    { id: 'sv4', name: 'Gateway of India', timeOffset: 45, waitingCount: 65 }
                ]
            }
        ],
        vehicles: [
            { id: 'v1', routeId: '340', currentStopIndex: 2, progress: 0.6, status: 'On Time', capacity: 'High' },
            { id: 'v2', routeId: '340', currentStopIndex: 4, progress: 0.1, status: 'On Time', capacity: 'Medium' },
            { id: 'v3', routeId: '506', currentStopIndex: 1, progress: 0.8, status: 'Delayed', capacity: 'High' },
            { id: 'v4', routeId: '703', currentStopIndex: 2, progress: 0.3, status: 'On Time', capacity: 'Low' },
            { id: 'v5', routeId: 'A1', currentStopIndex: 0, progress: 0.4, status: 'On Time', capacity: 'Low' },
            { id: 'v6', routeId: '123', currentStopIndex: 1, progress: 0.2, status: 'On Time', capacity: 'Medium' }
        ],
        alerts: [
            { id: 'a1', type: 'warning', message: 'Heavy traffic near Haji Ali junction — Route 340 may run 10 min late.', routeId: '340' },
            { id: 'a2', type: 'info', message: 'BEST introduces new electric buses on Route 506 starting next week.', routeId: '506' }
        ]
    },

    pune: {
        name: 'Pune',
        mapCenter: [18.5204, 73.8567],
        mapZoom: 12,
        operator: 'PMPML – Pune Mahanagar Parivahan Mahamandal Ltd.',
        routes: [
            {
                id: '11',
                name: 'Swargate – Hinjawadi',
                number: '11',
                color: 'bg-lime-500',
                textColor: 'text-lime-500',
                borderColor: 'border-lime-500',
                type: 'Bus',
                frequency: '10 min',
                pathPoints: [ {x:500, y:400}, {x:450, y:350}, {x:450, y:250}, {x:300, y:200}, {x:150, y:150} ],
                stops: [
                    { id: 's1', name: 'Swargate Bus Stand', timeOffset: 0, waitingCount: 26 },
                    { id: 's2', name: 'Deccan Gymkhana', timeOffset: 7, waitingCount: 13 },
                    { id: 's3', name: 'Shivajinagar', timeOffset: 13, waitingCount: 39 },
                    { id: 's4', name: 'Aundh', timeOffset: 21, waitingCount: 8 },
                    { id: 's5', name: 'Hinjawadi IT Park', timeOffset: 30, waitingCount: 44 }
                ]
            },
            {
                id: '54',
                name: 'Katraj – Wakad',
                number: '54',
                color: 'bg-teal-500',
                textColor: 'text-teal-500',
                borderColor: 'border-teal-500',
                type: 'Bus',
                frequency: '15 min',
                pathPoints: [ {x:550, y:550}, {x:550, y:450}, {x:650, y:300}, {x:400, y:150}, {x:300, y:150} ],
                stops: [
                    { id: 's6', name: 'Katraj Bus Depot', timeOffset: 0, waitingCount: 32 },
                    { id: 's7', name: 'Bibwewadi', timeOffset: 6, waitingCount: 20 },
                    { id: 's8', name: 'Pune Station', timeOffset: 14, waitingCount: 41 },
                    { id: 's9', name: 'Pimpri', timeOffset: 22, waitingCount: 9 },
                    { id: 's10', name: 'Wakad', timeOffset: 30, waitingCount: 15 }
                ]
            },
            {
                id: '7A',
                name: 'Hadapsar – Kothrud',
                number: '7A',
                color: 'bg-indigo-500',
                textColor: 'text-indigo-500',
                borderColor: 'border-indigo-500',
                type: 'Bus',
                frequency: '20 min',
                pathPoints: [ {x:800, y:400}, {x:650, y:400}, {x:550, y:450}, {x:400, y:350}, {x:300, y:350} ],
                stops: [
                    { id: 's11', name: 'Hadapsar Depot', timeOffset: 0, waitingCount: 24 },
                    { id: 's12', name: 'Fatima Nagar', timeOffset: 8, waitingCount: 37 },
                    { id: 's13', name: 'Market Yard', timeOffset: 15, waitingCount: 11 },
                    { id: 's14', name: 'Karve Road', timeOffset: 22, waitingCount: 28 },
                    { id: 's15', name: 'Kothrud Depot', timeOffset: 30, waitingCount: 4 }
                ]
            },
            {
                id: '201',
                name: 'Kothrud – Viman Nagar',
                number: '201',
                color: 'bg-rose-500',
                textColor: 'text-rose-500',
                borderColor: 'border-rose-500',
                type: 'Bus',
                frequency: '15 min',
                pathPoints: [ {x:200, y:400}, {x:400, y:400}, {x:600, y:300}, {x:800, y:200} ],
                stops: [
                    { id: 'pk1', name: 'Kothrud Stand', timeOffset: 0, waitingCount: 18 },
                    { id: 'pk2', name: 'Deccan Gymkhana', timeOffset: 10, waitingCount: 22 },
                    { id: 'pk3', name: 'Pune Station', timeOffset: 25, waitingCount: 51 },
                    { id: 'pk4', name: 'Viman Nagar', timeOffset: 45, waitingCount: 30 }
                ]
            },
            {
                id: 'E-Way',
                name: 'Pune Railway Stn – Mumbai (Asiad)',
                number: 'EXP-1',
                color: 'bg-blue-700',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-700',
                type: 'Express',
                frequency: '60 min',
                pathPoints: [ {x:600, y:150}, {x:300, y:150} ],
                stops: [
                    { id: 'ep1', name: 'Pune Railway Station', timeOffset: 0, waitingCount: 88 },
                    { id: 'ep2', name: 'Wakad Highway', timeOffset: 25, waitingCount: 14 },
                    { id: 'ep3', name: 'Mumbai Dadar Asiad', timeOffset: 180, waitingCount: 0 }
                ]
            }
        ],
        vehicles: [
            { id: 'v1', routeId: '11', currentStopIndex: 2, progress: 0.4, status: 'On Time', capacity: 'Medium' },
            { id: 'v2', routeId: '54', currentStopIndex: 1, progress: 0.9, status: 'Delayed', capacity: 'High' },
            { id: 'v3', routeId: '7A', currentStopIndex: 3, progress: 0.2, status: 'On Time', capacity: 'Low' },
            { id: 'v4', routeId: '11', currentStopIndex: 4, progress: 0.5, status: 'Early', capacity: 'Medium' },
            { id: 'v5', routeId: '201', currentStopIndex: 1, progress: 0.6, status: 'On Time', capacity: 'High' }
        ],
        alerts: [
            { id: 'a1', type: 'warning', message: 'Road construction at Shivajinagar — Route 11 diverted via FC Road.', routeId: '11' },
            { id: 'a2', type: 'info', message: 'PMPML revised winter timetable in effect. Route 54 last bus at 22:30.', routeId: 'all' }
        ]
    },

    nagpur: {
        name: 'Nagpur',
        mapCenter: [21.1458, 79.0882],
        mapZoom: 12,
        operator: 'NMC – Nagpur Municipal Corporation City Bus Service',
        routes: [
            {
                id: 'N1',
                name: 'Sitabuldi – MIDC Hingna',
                number: 'N1',
                color: 'bg-yellow-500',
                textColor: 'text-yellow-500',
                borderColor: 'border-yellow-500',
                type: 'Bus',
                frequency: '12 min',
                pathPoints: [ {x:500, y:300}, {x:550, y:300}, {x:550, y:200}, {x:300, y:250}, {x:150, y:250} ],
                stops: [
                    { id: 's1', name: 'Sitabuldi Bus Stand', timeOffset: 0, waitingCount: 16 },
                    { id: 's2', name: 'Cotton Market', timeOffset: 6, waitingCount: 34 },
                    { id: 's3', name: 'Jaripatka', timeOffset: 12, waitingCount: 7 },
                    { id: 's4', name: 'Wadi', timeOffset: 19, waitingCount: 25 },
                    { id: 's5', name: 'MIDC Hingna', timeOffset: 28, waitingCount: 42 }
                ]
            },
            {
                id: 'N3',
                name: 'Nagpur Railway Station – Airport',
                number: 'N3',
                color: 'bg-rose-500',
                textColor: 'text-rose-500',
                borderColor: 'border-rose-500',
                type: 'Bus',
                frequency: '25 min',
                pathPoints: [ {x:600, y:300}, {x:600, y:350}, {x:600, y:450}, {x:550, y:500}, {x:550, y:550} ],
                stops: [
                    { id: 's6', name: 'Nagpur Railway Station', timeOffset: 0, waitingCount: 30 },
                    { id: 's7', name: 'Residency Road', timeOffset: 8, waitingCount: 12 },
                    { id: 's8', name: 'Wardha Road', timeOffset: 15, waitingCount: 19 },
                    { id: 's9', name: 'Dr. Ambedkar Chowk', timeOffset: 22, waitingCount: 6 },
                    { id: 's10', name: 'Dr. Babasaheb Ambedkar Int\'l Airport', timeOffset: 30, waitingCount: 38 }
                ]
            },
            {
                id: 'N7',
                name: 'Kamptee – Dharampeth',
                number: 'N7',
                color: 'bg-cyan-500',
                textColor: 'text-cyan-500',
                borderColor: 'border-cyan-500',
                type: 'Bus',
                frequency: '18 min',
                pathPoints: [ {x:700, y:150}, {x:750, y:250}, {x:500, y:300}, {x:400, y:350} ],
                stops: [
                    { id: 's11', name: 'Kamptee Bus Terminus', timeOffset: 0, waitingCount: 22 },
                    { id: 's12', name: 'Kalamna Market', timeOffset: 7, waitingCount: 40 },
                    { id: 's13', name: 'Civil Lines', timeOffset: 14, waitingCount: 14 },
                    { id: 's14', name: 'Dharampeth', timeOffset: 21, waitingCount: 31 }
                ]
            },
            {
                id: 'N10',
                name: 'Dighori – Zero Mile',
                number: 'N10',
                color: 'bg-orange-600',
                textColor: 'text-orange-600',
                borderColor: 'border-orange-600',
                type: 'Bus',
                frequency: '15 min',
                pathPoints: [ {x:800, y:500}, {x:500, y:300} ],
                stops: [
                    { id: 'sn10-1', name: 'Dighori Naka', timeOffset: 0, waitingCount: 19 },
                    { id: 'sn10-2', name: 'Sakkardara', timeOffset: 8, waitingCount: 12 },
                    { id: 'sn10-3', name: 'Zero Mile Metro Stn', timeOffset: 20, waitingCount: 25 }
                ]
            },
            {
                id: 'N25',
                name: 'Kalamna – Pardi',
                number: 'N25',
                color: 'bg-teal-600',
                textColor: 'text-teal-600',
                borderColor: 'border-teal-600',
                type: 'Bus',
                frequency: '20 min',
                pathPoints: [ {x:900, y:100}, {x:850, y:200} ],
                stops: [
                    { id: 'sn25-1', name: 'Kalamna Market', timeOffset: 0, waitingCount: 44 },
                    { id: 'sn25-2', name: 'Pardi Naka', timeOffset: 12, waitingCount: 18 }
                ]
            }
        ],
        vehicles: [
            { id: 'v1', routeId: 'N1', currentStopIndex: 1, progress: 0.6, status: 'On Time', capacity: 'Medium' },
            { id: 'v2', routeId: 'N3', currentStopIndex: 2, progress: 0.3, status: 'On Time', capacity: 'Low' },
            { id: 'v3', routeId: 'N7', currentStopIndex: 1, progress: 0.8, status: 'Delayed', capacity: 'High' },
            { id: 'v4', routeId: 'N1', currentStopIndex: 3, progress: 0.1, status: 'Early', capacity: 'Medium' },
            { id: 'v5', routeId: 'N10', currentStopIndex: 0, progress: 0.5, status: 'On Time', capacity: 'Low' }
        ],
        alerts: [
            { id: 'a1', type: 'warning', message: 'VIP movement near Civil Lines — Route N7 may face 15 min delay.', routeId: 'N7' },
            { id: 'a2', type: 'info', message: 'NMC Metro Feeder buses operational from Nagpur Metro Phase-2 stations.', routeId: 'all' }
        ]
    },

    wardha: {
        name: 'Wardha',
        mapCenter: [20.7453, 78.6022],
        mapZoom: 13,
        operator: 'Wardha City Bus Service',
        routes: [
            {
                id: 'W1',
                name: 'Wardha Station – Sevagram',
                number: 'W1',
                color: 'bg-indigo-500',
                textColor: 'text-indigo-500',
                borderColor: 'border-indigo-500',
                type: 'Bus',
                frequency: '15 min',
                pathPoints: [ {x:400, y:300}, {x:450, y:300}, {x:500, y:250}, {x:600, y:200}, {x:700, y:250} ],
                stops: [
                    { id: 's1', name: 'Wardha Railway Station', timeOffset: 0, waitingCount: 28 },
                    { id: 's2', name: 'Bajaj Chowk', timeOffset: 5, waitingCount: 11 },
                    { id: 's3', name: 'MG Antarrashtriya Hindi Vishwavidyalaya', timeOffset: 11, waitingCount: 36 },
                    { id: 's4', name: 'Bapu Kuti', timeOffset: 17, waitingCount: 4 },
                    { id: 's5', name: 'Sevagram Ashram', timeOffset: 23, waitingCount: 18 }
                ]
            },
            {
                id: 'W2',
                name: 'Bus Stand – Pavnar',
                number: 'W2',
                color: 'bg-emerald-500',
                textColor: 'text-emerald-500',
                borderColor: 'border-emerald-500',
                type: 'Bus',
                frequency: '20 min',
                pathPoints: [ {x:450, y:350}, {x:500, y:450}, {x:450, y:500}, {x:400, y:600} ],
                stops: [
                    { id: 's6', name: 'Main Bus Stand', timeOffset: 0, waitingCount: 23 },
                    { id: 's7', name: 'Arvi Naka', timeOffset: 7, waitingCount: 9 },
                    { id: 's8', name: 'Datta Meghe Institute', timeOffset: 14, waitingCount: 33 },
                    { id: 's9', name: 'Pavnar Ashram', timeOffset: 21, waitingCount: 15 }
                ]
            },
            {
                id: 'W5',
                name: 'Shivaji Chowk – Kelzar',
                number: 'W5',
                color: 'bg-orange-500',
                textColor: 'text-orange-500',
                borderColor: 'border-orange-500',
                type: 'Bus',
                frequency: '45 min',
                pathPoints: [ {x:500, y:300}, {x:700, y:100} ],
                stops: [
                    { id: 'sw5-1', name: 'Shivaji Chowk', timeOffset: 0, waitingCount: 15 },
                    { id: 'sw5-2', name: 'Seloo', timeOffset: 15, waitingCount: 10 },
                    { id: 'sw5-3', name: 'Kelzar Ganpati', timeOffset: 30, waitingCount: 22 }
                ]
            },
            {
                id: 'W10',
                name: 'District Court – Pulgaon',
                number: 'W10',
                color: 'bg-sky-600',
                textColor: 'text-sky-600',
                borderColor: 'border-sky-600',
                type: 'Bus',
                frequency: '60 min',
                pathPoints: [ {x:400, y:300}, {x:200, y:300} ],
                stops: [
                    { id: 'sw10-1', name: 'District Court', timeOffset: 0, waitingCount: 4 },
                    { id: 'sw10-2', name: 'Pulgaon Station', timeOffset: 40, waitingCount: 25 }
                ]
            }
        ],
        vehicles: [
            { id: 'v1', routeId: 'W1', currentStopIndex: 1, progress: 0.5, status: 'On Time', capacity: 'Medium' },
            { id: 'v2', routeId: 'W2', currentStopIndex: 2, progress: 0.2, status: 'On Time', capacity: 'Low' },
            { id: 'v3', routeId: 'W5', currentStopIndex: 0, progress: 0.1, status: 'On Time', capacity: 'Low' }
        ],
        alerts: [
            { id: 'a1', type: 'info', message: 'Special buses running for Gandhi Jayanti via Sevagram.', routeId: 'all' }
        ]
    }
};

// Helper to get data for the selected city (defaults to Chennai)
const getCityData = (city) => {
    return CITY_DATA[city] || CITY_DATA['chennai'];
};

// Backward-compatible exports (use selected/default city)
const selectedCity = localStorage.getItem('selectedCity') || 'chennai';
const _cityData = getCityData(selectedCity);
const ROUTES = _cityData.routes;
const VEHICLES = _cityData.vehicles;
const ALERTS = _cityData.alerts;

// Helper to simulate live movement
const simulateMovement = (vehicles, routes) => {
    const routeList = routes || ROUTES;
    return vehicles.map(v => {
        let newProgress = v.progress + 0.05;
        let newIndex = v.currentStopIndex;

        if (newProgress >= 1) {
            newProgress = 0;
            newIndex += 1;
            const route = routeList.find(r => r.id === v.routeId);
            if (route && newIndex >= route.stops.length - 1) {
                newIndex = 0;
            }
        }
        return { ...v, currentStopIndex: newIndex, progress: newProgress };
    });
};

window.CITY_DATA = CITY_DATA;
window.getCityData = getCityData;