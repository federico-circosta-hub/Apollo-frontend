import { useContext, useRef } from "react";
import { NewVisitContext } from "../../Model/NewVisitContext";
import { PatientContext } from "../../Model/PatientContext";
import { Link } from "react-router-dom";
import "dayjs/locale/it";
import MyDocument from "../../ViewModel/PdfCreator";
import { useReactToPrint } from "react-to-print";
import MainContainer from "../../../common/View/MainContainer";
import exit from "./../../img/icon/logout.png";
import print from "./../../img/icon/print.png";

export default function EndVisit() {
  const { newVisit, setNewVisit } = useContext(NewVisitContext);
  const { selectedPatient, setSelectedPatient } = useContext(PatientContext);

  const componentRef = useRef();

  const handleclick = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <MainContainer>
        <h3>Report</h3>
        <div
          style={{
            overflow: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "80%",
            height: "80vh",
            borderRadius: "15px",
            border: "0.5px solid #56AEC9",
            boxShadow: "1px 2px 6px #56AEC9",
            background: "grey",
          }}
        >
          <MyDocument
            patient={selectedPatient}
            visit={newVisit}
            ref={componentRef}
          />
        </div>

        <div
          style={{
            display: "flex",
            marginBottom: "1.5%",
            justifyContent: "space-between",
            width: "40%",
          }}
        >
          <div>
            <Link
              to={"/"}
              className="btn btn-danger btn-lg"
              onClick={() => {
                setNewVisit(null);
                setSelectedPatient(null);
              }}
            >
              Esci{" "}
              <img
                src={exit}
                alt="uscita"
                width={38}
                height={38}
                style={{ filter: "invert(100%" }}
              />
            </Link>
          </div>
          <div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                handleclick();
                console.log(componentRef);
              }}
            >
              <div>
                Stampa{" "}
                <img
                  src={print}
                  alt="save or print"
                  width={38}
                  height={38}
                  style={{ filter: "invert(100%" }}
                />
              </div>
            </button>
          </div>
        </div>
      </MainContainer>
    </div>
  );
}

const styles = {
  box: {
    justifyContent: "space-around",
    width: "98%",
    height: "90vh",
    borderRadius: "15px",
    background: "white",
    margin: "auto",
    marginTop: "1%",
    paddingTop: "1%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  container: {
    width: "90%",
    padding: 5,
    height: "90%",
    display: "flex",
    flexDirection: "column",
    background: "white",
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 18,
  },
  link: {
    fontSize: 12,
  },
};
