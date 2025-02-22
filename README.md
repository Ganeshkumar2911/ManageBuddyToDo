# To-Do App 

## Introduction
This is a simple To-Do application that allows users to create multiple to-do lists, add tasks, mark them as completed, edit list names, and delete lists and tasks. The app uses React for the frontend and IndexedDB for data storage.

## Features
- User authentication with email.
- Create, edit, and delete multiple to-do lists.
- Add, delete, and mark tasks as completed.
- Persistent storage using IndexedDB.

## Project Setup
### Prerequisites
- Node.js and npm installed.

### Installation Steps
 # Install dependencies:
    1. npm install
    2. npm install -g firebase-tools

## Application Workflow
1. **User Logs In**: The app retrieves user data from IndexedDB.
2. **Create To-Do List**: Users enter a list name and click the add button.
3. **Add Tasks**: Users select a list and enter tasks.
4. **Edit List Name**: Users can rename a list by clicking the edit icon.
5. **Mark Task as Completed**: Users check the checkbox to mark tasks.
6. **Delete Lists & Tasks**: Users can delete tasks and lists permanently.

## Database Design (IndexedDB)
The app stores data in IndexedDB with the following structure:

- **Users** (Object Store)
  - `email`: Unique user identifier
  - `lists`: Object containing list names and their associated tasks

Example Data:

{
  "email": "user@example.com",
  "lists": {
    "Work": ["Task 1", "Task 2"],
    "Personal": ["Task A", "Task B"]
  }
}

# (IndexedDB Functions)


`getUserData(email)` | Fetch user data from IndexedDB.
`createUser(email)` | Create a new user entry. 
`addList(email, listName)` | Add a new to-do list. 
`addTask(email, listName, task)` | Add a task to a specific list. 
`updateListName(email, oldName, newName)` | Rename a to-do list. 
`deleteList(email, listName)` | Delete a specific to-do list. 
`deleteTask(email, listName, task)` | Delete a task from a list. 


## Future Improvements
- Enhance UI/UX with animations and better styling.
- Add support for cloud-based storage (e.g., Firebase) for better accessibility.
- Check Box functioning
## Conclusion
This to-do app provides a simple and efficient way to manage tasks. Future enhancements will improve usability and data management.

# NOTE 

# Database Information

Our To-Do application uses IndexedDB, which is a browser-based database. This means that data is stored locally on the device and is not automatically synchronized across multiple devices.

If a user logs in with the same credentials on a different device, they will not be able to retrieve their previously saved to-do lists and tasks.

However, authentication is handled through Firebase, ensuring secure user login and session management.

# Checkbox Functionality

The checkboxes in the application are currently used only for UI rendering and do not persist their checked state in the database.

When the page is refreshed, the checkboxes will return to their original unchecked state.

To make the checkboxes fully functional, a dedicated data structure for storing checkbox states can be implemented in the IndexedDB database.

This future enhancement would allow task completion states to persist even after a page refresh.

This documentation serves as a reference for future development and improvements in the application.



