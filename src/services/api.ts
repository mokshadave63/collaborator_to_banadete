const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials {
    name: string;
    email: string;
    password: string;
}

export interface DesignPayload {
    name: string;
    description?: string;
    designData: any;
    isPublic: boolean;
    tags?: string[];
    thumbnail?: string;
}

// Auth APIs
export const authAPI = {
    login: async (credentials: LoginCredentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    signup: async (credentials: SignupCredentials) => {
        const response = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    getProfile: async (token: string) => {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },
};

// Design APIs
export const designAPI = {
    create: async (designData: DesignPayload, token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(designData),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    getPublic: async (page = 1, limit = 10) => {
        const response = await fetch(`${API_URL}/designs?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    getUserDesigns: async (token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs/my-designs`, {
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    getById: async (id: string) => {
        const response = await fetch(`${API_URL}/designs/${id}`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    getByShareId: async (shareId: string) => {
        const response = await fetch(`${API_URL}/designs/share/${shareId}`);
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    update: async (id: string, designData: DesignPayload, token: string) => {
        const response = await fetch(`${API_URL}/designs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(designData),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    delete: async (id: string, token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    like: async (id: string, token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs/${id}/like`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    unlike: async (id: string, token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs/${id}/like`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    downloadDesign: async (id: string, token?: string) => {
        const authToken = token || localStorage.getItem('authToken');
        if (!authToken) throw new Error('Not authenticated');
        const response = await fetch(`${API_URL}/designs/${id}/download`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },
};
