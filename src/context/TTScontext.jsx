import React, { createContext, useState, useContext, useEffect } from "react";

const ScriptContext = createContext();

export const ScriptProvider = ({ children }) => {
    const scriptUrl = "https://code.responsivevoice.org/responsivevoice.js?key=3qxLYB3e";

    // Initialize state from localStorage
    const [isScriptAdded, setIsScriptAdded] = useState(() => {
        const savedState = localStorage.getItem("isScriptAdded");
        return savedState === "true";
    });

    const toggleScript = () => {
        const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);

        if (existingScript) {
            // Remove the script
            existingScript.remove();
            setIsScriptAdded(false);
            localStorage.setItem("isScriptAdded", "false");
            location.reload();
        } else {
            // Add the script
            const script = document.createElement("script");
            script.src = scriptUrl;
            script.onload = () => console.log("Script added.");
            document.body.appendChild(script);
            setIsScriptAdded(true);
            localStorage.setItem("isScriptAdded", "true");
            location.reload();
        }
    };

    // Ensure the script is added if the saved state is true
    useEffect(() => {
        if (isScriptAdded) {
            const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
            if (!existingScript) {
                const script = document.createElement("script");
                script.src = scriptUrl;
                script.onload = () => console.log("Script added after reload.");
                document.body.appendChild(script);
            }
        }
    }, [isScriptAdded]);

    return (
        <ScriptContext.Provider value={{ isScriptAdded, toggleScript }}>
            {children}
        </ScriptContext.Provider>
    );
};

export const useScript = () => useContext(ScriptContext);