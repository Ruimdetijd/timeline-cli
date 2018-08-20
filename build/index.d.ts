export declare enum MenuAction {
    BACK = "BACK",
    RELOAD = "RELOAD",
    QUIT = "QUIT",
}
declare const mainMenu: (message?: string, option?: string) => Promise<void>;
export default mainMenu;
