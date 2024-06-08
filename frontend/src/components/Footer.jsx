import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faEnvelope,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
    
    return (
    <div className="icon-container">
        <div className="back-rectangle">
            <button><FontAwesomeIcon icon={faHome} className="icon" /></button>
        </div>
        <div className="back-rectangle">
            <button><FontAwesomeIcon icon={faEnvelope} className="icon" /></button>
        </div>
        <div className="back-rectangle">
            <button><FontAwesomeIcon icon={faQuestionCircle} className="icon" /></button>
        </div>
      </div>
    )
}