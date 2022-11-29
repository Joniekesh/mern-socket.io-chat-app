import { useContext } from "react";
import { AlertContext } from "../../context/AlertContext";
import "./alert.scss";

const Alert = () => {
	const { alerts } = useContext(AlertContext);

	return (
		<div className="alertContainer">
			{alerts?.map((alert) => (
				<div className={`alert ${alert.alertType}`}>{alert.msg}</div>
			))}
		</div>
	);
};

export default Alert;
