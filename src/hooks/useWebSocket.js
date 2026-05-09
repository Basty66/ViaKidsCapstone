import { useState, useEffect, useCallback } from 'react';
import { Client } from '@stomp/stompjs';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws';
const RABBITMQ_USER = import.meta.env.VITE_RABBITMQ_USER || 'guest';
const RABBITMQ_PASS = import.meta.env.VITE_RABBITMQ_PASS || 'guest';

export const useWebSocket = ({ onNotification, onAttendanceUpdate, onLocationUpdate } = {}) => {
    const [connected, setConnected] = useState(false);
    const [client, setClient] = useState(null);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: WS_URL,
            connectHeaders: {
                login: RABBITMQ_USER,
                passcode: RABBITMQ_PASS,
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnected(true);

                if (onNotification) {
                    stompClient.subscribe('/queue/notifications', (message) => {
                        try {
                            onNotification(JSON.parse(message.body));
                        } catch {
                            onNotification({ message: message.body });
                        }
                    });
                }

                if (onAttendanceUpdate) {
                    stompClient.subscribe('/queue/attendance', (message) => {
                        try {
                            onAttendanceUpdate(JSON.parse(message.body));
                        } catch {
                            onAttendanceUpdate({ raw: message.body });
                        }
                    });
                }

                if (onLocationUpdate) {
                    stompClient.subscribe('/queue/locations', (message) => {
                        try {
                            onLocationUpdate(JSON.parse(message.body));
                        } catch {
                            onLocationUpdate({ raw: message.body });
                        }
                    });
                }
            },
            onDisconnect: () => {
                setConnected(false);
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message']);
                setConnected(false);
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => {
            stompClient.deactivate();
        };
    }, []);

    const publish = useCallback((destination, payload) => {
        if (client && connected) {
            client.publish({
                destination,
                body: JSON.stringify(payload),
            });
        }
    }, [client, connected]);

    return { connected, publish, client };
};
