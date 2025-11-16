# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Running the Application Locally

To run this application on your local machine using Visual Studio Code, follow these steps:

1.  **Open the project in VS Code.**

2.  **Open a new terminal** in VS Code (you can use `Ctrl+\`` or `Cmd+\``).

3.  **Install dependencies** by running the following command in the terminal:
    ```bash
    npm install
    ```

4.  **Start the Next.js development server** for the web application:
    ```bash
    npm run dev
    ```
    This will start the main application, and you can view it at `http://localhost:3000` (or another port if 3000 is in use).

5.  **Start the Genkit AI server** (optional, only if you are working on AI features). Open a *second* terminal and run:
     ```bash
    npm run genkit:dev
    ```
    This runs the AI flows that power features like the chatbot and insights.

You will need both servers running to use all the features of the application.