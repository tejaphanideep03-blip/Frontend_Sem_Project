const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const DB_KEY = 'mock_api_users_db';
const getUsers = () => JSON.parse(localStorage.getItem(DB_KEY) || '[]');

export const login = async (email, password) => {
    await delay(800);

    const users = getUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
        throw new Error('No account found with this email. Please sign up first.');
    }

    if (user.password !== password) {
        throw new Error('Incorrect password. Please try again.');
    }

    // Return a mock token and user object on success
    return {
        token: `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        user: { name: user.name, email: user.email }
    };
};

export const signup = async (name, email, password) => {
    await delay(800);
    const users = getUsers();
    const userExists = users.some((u) => u.email === email);

    if (userExists) {
        throw new Error('An account with this email already exists. Please sign in.');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(DB_KEY, JSON.stringify(users));
    return {
        token: `mock-token-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        user: { name: newUser.name, email: newUser.email }
    };
};
