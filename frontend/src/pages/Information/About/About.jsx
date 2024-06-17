import { Helmet } from "react-helmet";
import "./About.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faFlag,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="about-container main-wrapper">
      <Helmet>
        <title>{t("aboutUs")}</title>
      </Helmet>
      <div className={"about-texts"}>
        <h2>
          {t("aboutUs")} <FontAwesomeIcon icon={faCircleInfo} />
        </h2>
        <p>{t("aboutUsText")}</p>
        <h2>
          {t("ourMission")} <FontAwesomeIcon icon={faFlag} />
        </h2>
        <p>{t("ourMissionText")}</p>
        <h2>
          {t("ourTeam")} {""}
          <FontAwesomeIcon icon={faPeopleGroup} />
        </h2>
        <p>{t("ourTeamText")}</p>
      </div>
    </div>
  );
}
