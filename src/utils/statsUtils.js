import { QUESTION_TYPES } from '../types';

export const getQuestionStats = (question, responses) => {
    if (!responses || !responses.length) return null;

    const answers = responses.map(r => r.answers[question.id]).filter(Boolean);

    if (question.type === QUESTION_TYPES.SINGLE_CHOICE ||
        question.type === QUESTION_TYPES.MULTIPLE_CHOICE) {
        const counts = {};
        answers.forEach(answer => {
            const values = Array.isArray(answer) ? answer : [answer];
            values.forEach(v => {
                counts[v] = (counts[v] || 0) + 1;
            });
        });
        return counts;
    }

    if (question.type === QUESTION_TYPES.SCALE) {
        const values = answers.map(a => parseInt(a)).filter(v => !isNaN(v));
        if (values.length === 0) return null;
        const sum = values.reduce((a, b) => a + b, 0);
        return {
            average: (sum / values.length).toFixed(1),
            min: Math.min(...values),
            max: Math.max(...values),
            values
        };
    }

    return { total: answers.length };
};
