
'use server';
/**
 * @fileOverview A simple offline, rule-based chatbot flow.
 *
 * - askOfflineChatbot - A function that returns a pre-defined response based on keywords.
 */

// This is a very simple keyword-based offline "chatbot".
// It provides basic, safe advice for common ailments when the AI is not available.
export async function askOfflineChatbot(query: string): Promise<string> {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('headache')) {
        return "Offline advice for a headache:\n\n- Rest in a quiet, dark room.\n- Drink plenty of water.\n- A cool cloth on your forehead may help.\n\nIf the headache is severe, sudden, or accompanied by other symptoms like a stiff neck or confusion, please seek medical attention.";
    }

    if (lowerQuery.includes('fever')) {
        return "Offline advice for a fever:\n\n- Rest and drink plenty of fluids to stay hydrated.\n- Wear light clothing.\n\nSeek medical attention if the fever is very high or persistent.";
    }

    if (lowerQuery.includes('cut') || lowerQuery.includes('scrape')) {
        return "Offline advice for a minor cut or scrape:\n\n- Wash the area with soap and water.\n- Apply gentle pressure to stop any bleeding.\n- Cover with a clean bandage.\n\nFor deep cuts or bleeding that won't stop, seek medical attention.";
    }

    if (lowerQuery.includes('sprain') || lowerQuery.includes('strain')) {
        return "Offline advice for a sprain or strain:\n\nRemember R.I.C.E.:\n- **Rest:** Avoid using the injured area.\n- **Ice:** Apply a cold pack for 15-20 minutes at a time.\n- **Compression:** A compression bandage can help reduce swelling.\n- **Elevation:** Keep the injured limb raised above your heart level.\n\nIf you cannot bear weight on it or the pain is severe, please see a doctor.";
    }

    if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        return "Hello! I'm your offline assistant. I can provide some basic first-aid advice. How can I help? (e.g., 'I have a headache')";
    }

    return `It looks like you're currently offline. I am an offline assistant with limited capabilities.\n\nI can provide basic advice for general symptoms like "headache," "fever," "cut," or "sprain."\n\nFor a full analysis, please reconnect to the internet. If you are experiencing severe symptoms like chest pain, difficulty breathing, or a severe headache, please seek immediate medical attention.`;
}
