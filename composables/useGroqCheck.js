import { getApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";

export const useGroqCheckHomeWork = async ({ task, answer, level, locale }) => {
	try {
		const functions = getFunctions(getApp());

		const checkExamAnswer = httpsCallable(functions, 'checkExamAnswer');
		const response = await checkExamAnswer({ task, answer, level, locale });

		if (response.data?.error) {
			throw new Error(response.data.error);
		}

		return response.data?.data || response.data;

	} catch (error) {
		console.error("Exam Check Error:", error);
		return {
			result: "muss verbessert werden",
			feedback: "Не удалось проверить ответ. Попробуйте еще раз.",
			correctedVersion: answer
		};
	}
}