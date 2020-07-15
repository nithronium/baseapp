export const checkQuestionnaire = labels => {
    return labels.reduce((isQuestionnaire, obj) => {
        if (isQuestionnaire || obj.key === 'questionnaireform') {
            return true;
        }

        return isQuestionnaire;
    }, false);
};
