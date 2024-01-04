import {
    createContext,
    useContext,
    useReducer,
} from "react";
import { AuthContext } from "./AuthContext";
import {
    collection,
    getDocs,
    query,
    where
} from "firebase/firestore";
import { db } from "../firebase-config";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const { currentUser } = useContext(AuthContext);
    const INITIAL_STATE = {
        chatId: "null",
        user: {},
        group: {},
        users: [],
        usersUid: [],
        type: "",
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER":
                return {
                    user: action.payload,
                    chatId:
                        currentUser.uid > action.payload.uid
                            ? currentUser.uid + action.payload.uid
                            : action.payload.uid + currentUser.uid,
                    type: "privateChat",
                };

            case "CHANGE_GROUP":
                return {
                    group: action.payload.groupInfo,
                    chatId: action.payload.groupInfo.groupId,
                    users: getUsers(action.payload.users),
                    usersUid: action.payload.users,
                    type: "groupChat",
                };

            default:
                return state;
        }
    };

    const getUsers = async (usersUid) => {
        const filteredUsers = usersUid.filter(
            (user) => user.uid !== currentUser.uid
        );
        const q = query(
            collection(db, "users"),
            where("uid", "in", filteredUsers)
        );
        const querySnapshot = await getDocs(q);
        let users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        return users;

    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <ChatContext.Provider value={{ data: state, dispatch }}>
            {children}
        </ChatContext.Provider>
    );
};