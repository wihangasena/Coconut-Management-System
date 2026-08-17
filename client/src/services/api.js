const DEFAULT_API_BASE_URL = (() => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `${window.location.protocol}//${window.location.hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
})();

class APIService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${DEFAULT_API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders()
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        this.token = null;
        window.location.href = '/login';
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP Error ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // AUTH
  async login(username, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    this.setToken(data.token);
    return data;
  }

  async register(username, email, password, fullName, role) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, fullName, role })
    });
  }

  // DASHBOARD
  async getDashboardKpis() {
    return this.request('/dashboard/kpis');
  }

  // INTAKE
  async listCoconutBatches() {
    return this.request('/intake');
  }

  async createCoconutBatch(batchData) {
    return this.request('/intake', {
      method: 'POST',
      body: JSON.stringify(batchData)
    });
  }

  async updateCoconutBatch(id, batchData) {
    return this.request(`/intake/${id}`, {
      method: 'PUT',
      body: JSON.stringify(batchData)
    });
  }

  // PRODUCTION
  async listOilBatches() {
    return this.request('/production/oil');
  }

  async createOilBatch(batchData) {
    return this.request('/production/oil', {
      method: 'POST',
      body: JSON.stringify(batchData)
    });
  }

  async updateOilBatchStatus(id, status) {
    return this.request(`/production/oil/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }

  async listByProducts() {
    return this.request('/production/byproducts');
  }

  async createByProduct(productData) {
    return this.request('/production/byproducts', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async listCharcoalBatches() {
    return this.request('/production/charcoal');
  }

  async createCharcoalBatch(batchData) {
    return this.request('/production/charcoal', {
      method: 'POST',
      body: JSON.stringify(batchData)
    });
  }

  // INVENTORY
  async listInventory() {
    return this.request('/inventory');
  }

  async createInventoryItem(itemData) {
    return this.request('/inventory', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async updateInventoryItem(id, itemData) {
    return this.request(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(itemData)
    });
  }

  // SALES
  async listSalesOrders() {
    return this.request('/sales');
  }

  async createSalesOrder(orderData) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async updateSalesOrder(id, orderData) {
    return this.request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData)
    });
  }

  // QUALITY
  async listQualityRecords() {
    return this.request('/quality');
  }

  async createQualityRecord(recordData) {
    return this.request('/quality', {
      method: 'POST',
      body: JSON.stringify(recordData)
    });
  }

  async updateQualityRecord(id, recordData) {
    return this.request(`/quality/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recordData)
    });
  }

  // USERS
  async listUsers() {
    return this.request('/users');
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    });
  }

  // SETTINGS
  async getSettings() {
    return this.request('/settings');
  }
}

export default new APIService();
