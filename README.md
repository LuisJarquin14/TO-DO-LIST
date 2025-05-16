# To-Do List Application

A modern, clean, and responsive to-do list web application that allows users to manage their daily tasks efficiently with a beautiful and intuitive user interface.

![To-Do List App Screenshot](/public/screenshot.png)

## Features

- **Add Tasks**: Quickly add new tasks to your list using the input field and the Add button or by pressing Enter.
- **Delete Tasks**: Remove tasks you no longer need with a single click (with confirmation).
- **Mark as Complete**: Toggle tasks between complete and incomplete status using the checkbox.
- **Edit Tasks Inline**: Double-click or press Enter on a task to edit it directly in the list.
- **Filter Tasks**: View all, active, or completed tasks using the filter buttons.
- **Clear Completed**: Remove all completed tasks at once with the Clear Completed button.
- **Task Counter**: Shows how many active tasks remain.
- **Persistent Storage**: All tasks and settings are saved in your browser's local storage, so your data is safe even after closing the browser.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.
- **Animations**: Smooth animations for a better user experience.
- **Dark/Light Theme**: Easily switch between dark and light mode with a toggle button. The selected theme is remembered.
- **Language Toggle**: Instantly switch the interface between English and Spanish. All labels, buttons, and alerts update dynamically.
- **Accessibility**: Keyboard navigation, ARIA labels, and focus styles for an inclusive experience.
- **No Dependencies or Installation**: Just open the HTML file in your browser. No build process or server setup required.

## Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required

### Setup

1. Clone this repository or download the files:

   ```bash
   git clone https://github.com/yourusername/to-do-list.git
   ```

2. Open the `app/index.html` file in your web browser.

   That's it! No build process or server setup required.

## Usage

1. **Adding a Task**:
   - Type your task in the input field
   - Press Enter or click the "Add" button

2. **Completing a Task**:
   - Click the checkbox next to a task to mark it as complete
   - Click again to mark it as incomplete

3. **Editing a Task**:
   - Double-click or press Enter on the task text to edit it inline
   - Press Enter or click outside to save changes

4. **Deleting a Task**:
   - Click the trash icon next to a task to delete it (with confirmation)

5. **Filtering Tasks**:
   - Click "All" to view all tasks
   - Click "Active" to view only incomplete tasks
   - Click "Completed" to view only completed tasks

6. **Clearing Completed Tasks**:
   - Click the "Clear Completed" button to remove all completed tasks

7. **Switching Theme**:
   - Click the moon/sun icon in the header to toggle between dark and light mode

8. **Switching Language**:
   - Click the language icon in the header to toggle between English and Spanish

## Technical Details

This application is built with:

- **HTML5**: For semantic structure
- **CSS3**: For modern styling, animations, and responsive design
- **JavaScript (ES6+)**: For all functionality, using a modular and object-oriented approach
- **LocalStorage API**: For persistent data storage (tasks and settings)
- **Font Awesome**: For icons (via CDN)
- **SweetAlert2**: For beautiful confirmation dialogs (via CDN)

## Project Structure

- `app/index.html`: Main HTML document
- `app/style.css`: CSS styling
- `app/script.js`: JavaScript functionality
- `README.md`: Project documentation

## Accessibility & Best Practices

- Keyboard navigation and focus management
- ARIA labels for screen readers
- Responsive and mobile-friendly layout
- All user actions provide feedback (animations, alerts, counters)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Font Awesome for the icons
- SweetAlert2 for the alert dialogs
- Inspiration from various modern to-do list applications