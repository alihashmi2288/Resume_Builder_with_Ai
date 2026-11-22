

# Curio — Your career, clearly expressed.

![Curio Hero](https://i.imgur.com/8Q5p7y9.png)

**Curio** is an AI-powered resume builder that helps you turn your skills, experience, and achievements into a polished, ATS-ready resume—with built-in AI Assistance and complete control over every detail.

---

## ✨ Core Features

-   **🤖 AI-Powered Content Generation**: Leverage Google Gemini to:
    -   Generate a complete resume draft from just a job title.
    -   Craft a compelling professional summary based on your experience.
    -   Enhance your work experience bullet points to be more impactful.
    -   Suggest relevant skills for your target role.
-   **📝 Cover Letter Generation**: Automatically create a tailored cover letter using your resume data and a job description.
-   **🔑 ATS Keyword Optimization**: Paste a job description to get AI-powered suggestions for keywords to improve your resume's visibility to applicant tracking systems.
-   **🎨 Multiple Professional Templates**: Choose from a diverse collection of beautifully designed templates, from classic and modern to creative and technical.
-   **👁️ Live Preview**: See your resume update in real-time as you type, with a pixel-perfect preview of the final document.
-   **🔒 Privacy First**: All your resume data is stored locally in your browser's `localStorage`. No data is ever sent to a server.
-   **📄 High-Quality PDF Export**: Download your final resume as a clean, high-resolution PDF, ready for job applications.
-   **🌓 Light & Dark Mode**: A sleek and comfortable UI that adapts to your preference.
-   **📱 Fully Responsive**: Build your resume on any device, whether it's a desktop, a tablet, or a mobile phone.

## 🛠️ Tech Stack

-   **Frontend**: React, TypeScript
-   **Styling**: Tailwind CSS
-   **AI**: Google Gemini API (`@google/genai`)
-   **Routing**: React Router
-   **PDF Generation**: jsPDF, html2canvas
-   **Icons**: Lucide React

## 🚀 Getting Started

This project is a client-side only application and does not require a complex build process.

1.  **Environment Variable**: This application requires a Google Gemini API key. It must be available as an environment variable named `API_KEY`. The execution environment (e.g., an online IDE or a server setup) must inject this variable.

2.  **Serve the files**: Use any simple local web server to serve the `index.html` file. A popular choice is the `serve` package:
    ```bash
    # Install serve globally (if you haven't already)
    npm install -g serve

    # Serve the project directory
    serve .
    ```

3.  **Open in Browser**: Navigate to the local address provided by the server (e.g., `http://localhost:3000`).

## 📁 Project Structure

```
.
├── components/         # Reusable UI components
│   ├── builder/        # Components specific to the Builder page
│   ├── templates/      # Resume template components
│   └── ui/             # General-purpose UI elements (Button, Header, etc.)
├── context/            # React Context for global state (e.g., theme)
├── hooks/              # Custom React hooks (e.g., useResumeStore)
├── lib/                # Utility functions (e.g., PDF generation)
├── pages/              # Top-level page components
├── services/           # API service calls (e.g., Gemini integration)
├── App.tsx             # Main application component with routing
├── index.html          # The single HTML entry point
└── index.tsx           # The root React render script
```