
import { GoogleGenAI } from "@google/genai";
import { Patient, Doctor, Hospital } from '../types';

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePatientSummary = async (patient: Patient, doctor: Doctor, hospital: Hospital): Promise<string> => {
    if (!apiKey) {
        return "Error: Gemini API key is not configured. Please set the API_KEY environment variable.";
    }

    const prompt = `
        Generate a concise, easy-to-understand summary for a patient's family member. 
        The summary should be professional, empathetic, and avoid overly technical jargon.
        It should be written in the context of a hospital in Bangladesh.

        Patient Information:
        - Name: ${patient.name}
        - Age: ${patient.age}
        - Gender: ${patient.gender}
        - Admission Date: ${patient.admissionDate}

        Hospital & Doctor Information:
        - Hospital: ${hospital.name}, ${hospital.address}
        - Attending Doctor: Dr. ${doctor.name} (${doctor.specialization})

        Treatment Notes from Doctor:
        "${patient.treatment}"

        Based on the information above, please generate the summary. Start with a polite greeting.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating patient summary:", error);
        return "An error occurred while generating the patient summary. Please check the console for details.";
    }
};
   