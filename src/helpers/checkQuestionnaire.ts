export const checkQuestionnaire = labels => {
    return labels.reduce((isQuestionnaire, obj) => {
        if (isQuestionnaire || obj.key === 'questionnaire') {
            return true;
        }
        return isQuestionnaire;
    }, false);
};
