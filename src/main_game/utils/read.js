import readJSON from "./readJSON";

export function readQuestions () {
    return readJSON("src/main_game/fixtures/questions.json");
};

export function readUsers () {
    return readJSON("src/main_game/fixtures/users.json");
}