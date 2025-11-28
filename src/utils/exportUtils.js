export const exportToJSON = (data, filename = 'export.json') => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, filename);
};

export const exportToCSV = (responses, questions, filename = 'responses.csv') => {
    if (!responses || responses.length === 0) {
        throw new Error('No responses to export');
    }

    // Create CSV headers
    const headers = ['Submitted At', 'IP', ...questions.map(q => q.title || 'Untitled')];

    // Create CSV rows
    const rows = responses.map(response => {
        const row = [
            new Date(response.submittedAt).toLocaleString(),
            response.ip || 'N/A'
        ];

        // Add answer for each question
        questions.forEach(question => {
            const answer = response.answers?.[question.id];

            if (!answer || answer === '') {
                row.push('');
            } else if (Array.isArray(answer)) {
                // Multiple choice - join with semicolon
                row.push(answer.join('; '));
            } else if (typeof answer === 'object') {
                // Object answer - stringify
                row.push(JSON.stringify(answer));
            } else {
                row.push(String(answer).replace(/"/g, '""')); // Escape quotes
            }
        });

        return row;
    });

    // Combine headers and rows
    const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, filename);
};

const downloadBlob = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

export const formatResponsesForExport = (form) => {
    return {
        formTitle: form.title,
        formDescription: form.description,
        exportedAt: new Date().toISOString(),
        totalResponses: form.responses?.length || 0,
        questions: form.questions,
        responses: form.responses || []
    };
};
