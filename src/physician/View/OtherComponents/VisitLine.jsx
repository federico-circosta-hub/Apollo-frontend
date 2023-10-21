import { format } from "date-fns";
import itLocale from "date-fns/locale/it";

export default function VisitLine(props) {
  const select = () => {
    props.onSelectVisit();
  };

  const formatDate = () => {
    return (
      format(new Date(props.visit.date), "dd", { locale: itLocale }) +
      " " +
      format(new Date(props.visit.date), "MMMM", { locale: itLocale }).padEnd(
        12,
        " "
      ) +
      format(new Date(props.visit.date), "y", { locale: itLocale })
    );
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
      <td>{props.visit.physician}</td>
      <td>
        {props.visit.type !== null
          ? props.visit.type
          : "In attesa di trascrizione..."}
      </td>
    </tr>
  );
}
