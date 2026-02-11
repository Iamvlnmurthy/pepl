import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

export const employeesApi = {
    getAll: () => api.get('/employees'),
    getById: (id: string) => api.get(`/employees/${id}`),
    create: (data: any) => api.post('/employees', data),
    update: (id: string, data: any) => api.patch(`/employees/${id}`, data),
};

export const attendanceApi = {
    checkIn: (data: { employeeId: string; companyId: string; location: any }) => api.post('/attendance/check-in', data),
    checkOut: (id: string, location: any) => api.post(`/attendance/check-out/${id}`, { location }),
};
