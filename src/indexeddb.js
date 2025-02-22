const DB_NAME = "TodoApp";
const DB_VERSION = 1;
const STORE_NAME = "users";
const request = indexedDB.open("TodoApp",1);


request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if(!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users",{keyPath:"email"});
    }
}

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("users")) {
                db.createObjectStore("users", { keyPath: "email" });
            }
        };

        request.onsuccess = (event) => resolve(event.target.result);
        request.onerror = () => reject("Error opening IndexedDB");
    });
};


export function getUserData(email) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("users", "readonly");
            const store = transaction.objectStore("users");
            const request = store.get(email);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Failed to fetch user data");
        });
    });
}

export function createUser(email) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("users", "readwrite");
            const store = transaction.objectStore("users");
            const newUser = { email, lists: {} };

            const request = store.add(newUser);

            request.onsuccess = () => resolve(newUser);
            request.onerror = () => reject("Failed to create user");
        });
    });
}

export function addList(email, listName) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("users", "readwrite");
            const store = transaction.objectStore("users");

            const request = store.get(email);
            request.onsuccess = () => {
                const userData = request.result;
                if (!userData) {
                    reject("User not found");
                    return;
                }

                // Add new list
                if (!userData.lists[listName]) {
                    userData.lists[listName] = [];
                }

                const updateRequest = store.put(userData);
                updateRequest.onsuccess = () => resolve(userData);
                updateRequest.onerror = () => reject("Failed to add list");
            };
            request.onerror = () => reject("Error fetching user data");
        });
    });
}

export function addTask(email, listName, task) {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction("users", "readwrite");
            const store = transaction.objectStore("users");

            const request = store.get(email);
            request.onsuccess = () => {
                const userData = request.result;
                if (!userData) {
                    reject("User not found");
                    return;
                }

                if (!userData.lists[listName]) {
                    reject("List not found");
                    return;
                }
                const task1 = { text: task, completed: false};
                userData.lists[listName].push(task1);

                const updateRequest = store.put(userData);
                updateRequest.onsuccess = () => resolve(userData);
                updateRequest.onerror = () => reject("Failed to add task");
            };
            request.onerror = () => reject("Error fetching user data");

        });
    });
}

export const deleteList = (email, listName) => {
    return new Promise((resolve, reject) => {
        openDB().then((db) => {
            const transaction = db.transaction("users", "readwrite");
            const store = transaction.objectStore("users");

            const getRequest = store.get(email);
            getRequest.onsuccess = () => {
                const userData = getRequest.result;
                if (userData && userData.lists[listName]) {
                    delete userData.lists[listName]; // Remove
                    store.put(userData);
                    resolve(userData);
                } else {
                    reject("List not found");
                }
            };
            getRequest.onerror = () => reject("Failed to fetch user data");
        }).catch(reject);
    });
};

export function deleteTask(email, listName, taskToDelete) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("TodoApp", 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction("users", "readwrite");
            const store = transaction.objectStore("users");

            const getRequest = store.get(email);

            getRequest.onsuccess = () => {
                let userData = getRequest.result;
                if (userData) {
                    userData.lists[listName] = userData.lists[listName].filter(task => task.text !== taskToDelete.text);

                    store.put(userData).onsuccess = () => {
                        resolve(userData);
                    };
                } else {
                    reject("User not found");
                }
            };

            getRequest.onerror = () => reject("Error fetching user data");
        };

        request.onerror = () => reject("IndexedDB error");
    });
}

export const updateListName = async (email, oldName, newName) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(["users"], "readwrite");
            const store = transaction.objectStore("users");

            const getRequest = store.get(email);

            getRequest.onsuccess = () => {
                const userData = getRequest.result;
                if (!userData) {
                    reject("User not found");
                    return;
                }

                if (userData.lists[newName]) {
                    reject("A list with this name already exists!");
                    return;
                }

                userData.lists[newName] = userData.lists[oldName];
                delete userData.lists[oldName];

                const updateRequest = store.put(userData);

                updateRequest.onsuccess = () => resolve(userData);
                updateRequest.onerror = () => reject("Failed to update list name");
            };

            getRequest.onerror = () => reject("Failed to retrieve user data");
        };

        request.onerror = () => reject("IndexedDB error");
    });
};


// Save or update user data in IndexedDB
export async function saveUserData(email, lists) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        
        // Store only email and lists (NOT entire userData object)
        const request = store.put({ email, lists });

        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
    });
}