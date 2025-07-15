import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../data/users.json');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  static async ensureDataFile() {
    try {
      await fs.ensureFile(DB_PATH);
      const data = await fs.readFile(DB_PATH, 'utf8');
      if (!data.trim()) {
        await fs.writeFile(DB_PATH, JSON.stringify([]));
      }
    } catch (error) {
      await fs.writeFile(DB_PATH, JSON.stringify([]));
    }
  }

  static async getAll() {
    await this.ensureDataFile();
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  }

  static async save(users) {
    await this.ensureDataFile();
    await fs.writeFile(DB_PATH, JSON.stringify(users, null, 2));
  }

  static async findByEmail(email) {
    const users = await this.getAll();
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    const users = await this.getAll();
    return users.find(user => user.id === id);
  }

  static async create(userData) {
    const users = await this.getAll();
    const user = new User(userData);
    users.push(user);
    await this.save(users);
    return user;
  }

  static async update(id, updates) {
    const users = await this.getAll();
    const index = users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
    await this.save(users);
    return users[index];
  }

  static async delete(id) {
    const users = await this.getAll();
    const filtered = users.filter(user => user.id !== id);
    await this.save(filtered);
    return true;
  }
}

export default User;