
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  username: string;
}

interface DecodedToken {
  userId: string;
  username: string;
  exp: number;
}

interface Question {
  id: string;
  content: string;
  createdAt: string;
  answer?: string;
  answeredAt?: string;
}

// This is a mock API service that simulates JWT auth and data storage
// In a real app, this would connect to a backend server
class ApiService {
  private token: string | null = null;
  private users: User[] = [];
  private questions: Record<string, Question[]> = {};
  
  constructor() {
    // Load data from localStorage for persistence
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    try {
      this.token = localStorage.getItem('auth_token');
      const storedUsers = localStorage.getItem('users');
      const storedQuestions = localStorage.getItem('questions');
      
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      
      if (storedQuestions) {
        this.questions = JSON.parse(storedQuestions);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }
  
  private saveToStorage() {
    try {
      if (this.token) {
        localStorage.setItem('auth_token', this.token);
      } else {
        localStorage.removeItem('auth_token');
      }
      
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('questions', JSON.stringify(this.questions));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }
  
  private generateToken(user: User): string {
    // In a real app, this would be done server-side
    const payload = {
      userId: user.id,
      username: user.username,
      exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
    };
    
    // This is a simplified token creation, not secure for production
    return btoa(JSON.stringify(payload));
  }
  
  private verifyToken(): DecodedToken | null {
    if (!this.token) return null;
    
    try {
      const decoded = JSON.parse(atob(this.token)) as DecodedToken;
      
      // Check if token is expired
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        this.token = null;
        return null;
      }
      
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      this.token = null;
      return null;
    }
  }
  
  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  isAuthenticated(): boolean {
    return this.verifyToken() !== null;
  }
  
  getCurrentUser(): User | null {
    const decoded = this.verifyToken();
    if (!decoded) return null;
    
    const user = this.users.find(u => u.id === decoded.userId);
    return user || null;
  }
  
  async register(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    // Check if username is taken
    if (this.users.some(u => u.username === username)) {
      return { success: false, message: 'Username already taken' };
    }
    
    const newUser: User = {
      id: this.generateId(),
      username
    };
    
    // In a real app, we would hash the password
    const passwordHash = password;
    
    this.users.push(newUser);
    this.questions[newUser.id] = [];
    
    // Generate token for auto-login
    this.token = this.generateToken(newUser);
    
    this.saveToStorage();
    
    return { success: true };
  }
  
  async login(username: string, password: string): Promise<{ success: boolean; message?: string }> {
    // In a real app, this would validate against hashed passwords
    const user = this.users.find(u => u.username === username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    this.token = this.generateToken(user);
    this.saveToStorage();
    
    return { success: true };
  }
  
  logout() {
    this.token = null;
    this.saveToStorage();
  }
  
  async getQuestions(): Promise<Question[]> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    return this.questions[user.id] || [];
  }
  
  async submitAnonymousQuestion(username: string, content: string): Promise<{ success: boolean; message?: string }> {
    const targetUser = this.users.find(u => u.username === username);
    
    if (!targetUser) {
      return { success: false, message: 'User not found' };
    }
    
    if (!this.questions[targetUser.id]) {
      this.questions[targetUser.id] = [];
    }
    
    const newQuestion: Question = {
      id: this.generateId(),
      content,
      createdAt: new Date().toISOString()
    };
    
    this.questions[targetUser.id].push(newQuestion);
    this.saveToStorage();
    
    return { success: true };
  }
  
  async answerQuestion(questionId: string, answer: string): Promise<{ success: boolean; message?: string }> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    
    const userQuestions = this.questions[user.id] || [];
    const questionIndex = userQuestions.findIndex(q => q.id === questionId);
    
    if (questionIndex === -1) {
      return { success: false, message: 'Question not found' };
    }
    
    userQuestions[questionIndex] = {
      ...userQuestions[questionIndex],
      answer,
      answeredAt: new Date().toISOString()
    };
    
    this.saveToStorage();
    
    return { 
      success: true
    };
  }
  
  async getUserByUsername(username: string): Promise<User | null> {
    return this.users.find(u => u.username === username) || null;
  }
  
  async getQuestionById(userId: string, questionId: string): Promise<Question | null> {
    const userQuestions = this.questions[userId] || [];
    return userQuestions.find(q => q.id === questionId) || null;
  }
}

export const api = new ApiService();
export type { User, Question };
