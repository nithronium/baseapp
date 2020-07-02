export const checkQuestionnaire = labels => {
    return labels.reduce((isQuestionnaire, obj) => {
        if (isQuestionnaire || obj.key === 'questionnaireForm') {
            return true;
        }
        return isQuestionnaire;
    }, false);
};
