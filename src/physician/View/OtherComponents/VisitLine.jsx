import { format } from "date-fns";
import itLocale from "date-fns/locale/it";

export default function VisitLine(props) {
  const select = () => {
    props.onSelectVisit();
  };

  const formatDate = () => {
    const dateString = format(new Date(props.visit.date), "cccc dd MMMM y", {
      locale: itLocale,
    });
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  return (
    <tr
      className="tr-lg"
      style={{
        /*  borderBottom: '0.5px solid lightgray', */ padding: 30,
      }}
      onClick={() => select()}
    >
      {/*       <td>{props.visit.id}</td> */}
      <td>{formatDate()}</td>
      <td>
        {props.visit.physicianName} {props.visit.physicianSurname}
      </td>
      <td>{props.visit.physician}</td>

      <td>
        {props.visit.type ? props.visit.type : "In attesa di trascrizione"}
      </td>
    </tr>
  );
}
