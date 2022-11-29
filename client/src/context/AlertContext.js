import { createContext, useReducer } from "react";

export const AlertContext = createContext();

const initialState = {
	alerts: [],
};

const AlertReducer = (state, action) => {
	switch (action.type) {
		case "SET_ALERT":
			return {
				...state,
				alerts: [...state.alerts, action.payload],
			};
		case "REMOVE_ALERT":
			return {
				...state,
				alerts: state.alerts.filter((alert) => alert.id !== action.payload),
			};
		default:
			return state;
	}
};

export const AlertContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AlertReducer, initialState);

	return (
		<AlertContext.Provider value={{ alerts: state.alerts, dispatch }}>
			{children}
		</AlertContext.Provider>
	);
};
