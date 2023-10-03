import { React, forwardRef } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";
import format from "date-fns/format";

const MyDocument = forwardRef((props, ref) => {
  const visit = props.visit;
  const patient = props.patient;

  return (
    <div style={styles.container} ref={ref}>
      <h1>HEAD-US score</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              border: "0.5px solid lightgray",
              alignSelf: "flex-start",
              padding: 5,
            }}
          >
            <p style={styles.text}>
              Patient: {patient.name} {patient.surname}
            </p>
            <p style={styles.text}>
              Birthdate: {format(patient.birthdate, "dd - MM - y")}
            </p>
            <p style={styles.text}>
              Age: {new Date().getFullYear() - patient.birthdate.getFullYear()}
            </p>
            <p style={styles.text}>Gender: {patient.gender}</p>
            <p style={styles.text}>Weight: {patient.weight}</p>
            <p style={styles.text}>Height: {patient.height}</p>
            <p style={styles.text}>
              Prothesis:{" "}
              {patient.prothesis !== null
                ? patient.prothesis.toString()
                : "Nessuna"}
            </p>
          </div>
        </div>
        <div>
          <h5>Visit date: {format(visit.visitDate, "dd-MM-y")}</h5>
        </div>
      </div>
      <div>
        <p style={styles.link}>coming soon... </p>
      </div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget
        varius nisl. Donec egestas, neque et feugiat volutpat, est mi rutrum
        turpis, in mollis tortor justo ac justo. Maecenas ultricies pretium est.
        Sed leo mauris, lacinia non ullamcorper ac, sollicitudin sit amet est.
        Etiam non nisl vel purus ullamcorper feugiat. Maecenas quis est ac ex
        mattis ullamcorper. Sed sit amet lorem leo. Cras id risus sollicitudin,
        dictum magna eu, tempor sem. Curabitur convallis lectus ut cursus
        consequat. Praesent in ligula commodo, facilisis turpis a, lobortis
        purus. Phasellus suscipit feugiat aliquet. Nunc dapibus mi sem, non
        tincidunt quam vestibulum ac. Vestibulum ut nibh enim. Donec tempus diam
        leo, a aliquet velit vulputate non. Aliquam vel neque eget tortor
        gravida accumsan. Morbi suscipit pulvinar massa vel euismod. Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Suspendisse aliquam, velit
        at interdum congue, nulla tellus sollicitudin massa, vitae porttitor
        augue ligula sed purus. Vestibulum ullamcorper massa a nunc eleifend, ac
        efficitur ex ullamcorper. In tortor turpis, tincidunt eget tempus vitae,
        ullamcorper eget orci. Pellentesque viverra, est at lobortis convallis,
        est orci laoreet sem, a vehicula lorem sapien semper massa. Etiam
        fermentum dui interdum lacus pharetra, eget scelerisque urna mollis.
        Curabitur molestie quam leo, sit amet ornare metus maximus nec. Mauris
        ullamcorper sem in hendrerit placerat. Nulla orci tortor, semper vitae
        sollicitudin sit amet, pellentesque commodo purus. Donec ultrices magna
        ligula, sed sollicitudin ex pellentesque vel. Phasellus purus dolor,
        mollis et imperdiet a, fringilla vel nunc. Nam viverra, massa a ultrices
        tincidunt, mauris mi eleifend quam, vel congue erat orci sit amet ante.
        Vestibulum ornare diam at metus molestie tristique. Morbi aliquam non
        libero id molestie. Curabitur eleifend pretium ligula sit amet
        elementum. Ut facilisis leo nec fermentum dignissim. Nulla sapien quam,
        auctor at venenatis luctus, accumsan in nibh. Mauris eleifend justo
        elementum, convallis dui sed, semper metus. Aliquam ac lectus sed erat
        accumsan fermentum vel quis sem. In in arcu venenatis tortor elementum
        pharetra. Ut nec placerat diam. Nullam tempus quam a purus bibendum, vel
        imperdiet arcu dictum. Pellentesque eu sodales lectus. Ut augue tellus,
        fringilla eget sapien quis, fringilla euismod erat. Sed ultrices nec
        eros eu tempus. Sed ut rutrum arcu. Cras vel ligula pretium, elementum
        leo ac, convallis mi. Sed ipsum dolor, gravida lacinia metus sit amet,
        faucibus pulvinar quam. Quisque eget placerat tellus, molestie iaculis
        eros. Aenean rhoncus sed dolor ut vestibulum. Sed finibus diam sit amet
        diam egestas pharetra. Mauris urna erat, gravida sed mollis in,
        sollicitudin eget orci. Etiam vestibulum odio a tellus euismod, sit amet
        tincidunt risus tincidunt. Mauris tincidunt, lectus in suscipit
        scelerisque, velit metus lacinia tortor, quis auctor enim erat eget
        elit. Curabitur porttitor sollicitudin vestibulum. Nam justo risus,
        congue nec diam at, dapibus pellentesque leo. Integer euismod erat
        sapien, nec lacinia lacus aliquet et. Sed nisi lacus, porta ac massa
        sed, gravida volutpat quam. Suspendisse potenti. Pellentesque facilisis
        ligula nec leo dapibus fringilla. Sed porta erat vel suscipit volutpat.
        Nullam eget erat in sem vehicula ultricies. Pellentesque habitant morbi
        tristique senectus et netus et malesuada fames ac turpis egestas. Donec
        tristique tellus maximus risus placerat semper. Praesent volutpat
        sodales felis, vitae ornare ex interdum in. Cras ultricies rutrum magna,
        ac rhoncus lacus aliquet vel. Maecenas pharetra, metus maximus vulputate
        dictum, orci sapien bibendum turpis, sit amet vestibulum erat urna eu
        libero. Vestibulum rutrum tincidunt quam eget tincidunt. Orci varius
        natoque penatibus et magnis dis parturient montes, nascetur ridiculus
        mus. Aenean luctus sed lacus vitae pulvinar. Etiam malesuada faucibus
        posuere. Quisque volutpat tincidunt ultrices. Maecenas commodo odio
        posuere purus efficitur, at efficitur neque dictum. Nunc quis ante sed
        libero pulvinar placerat. Vestibulum dictum enim ligula, nec efficitur
        tortor porta sed. Sed quis ex ac enim aliquet blandit. Nunc vel neque
        tellus. Aenean vulputate sem a bibendum fringilla. Vivamus volutpat
        justo at tortor varius accumsan. Aliquam pretium elementum lacus blandit
        consequat. Morbi id pulvinar velit. Cras vehicula, sapien a euismod
        laoreet, ante odio elementum purus, vel ultrices felis magna a turpis.
        Cras viverra dolor sit amet arcu viverra, ut molestie lorem tempus.
        Fusce accumsan rutrum risus, at pulvinar dolor elementum quis. Aenean
        sed mattis enim, ut sodales metus. Vestibulum eleifend elit fringilla
        dui mattis, eget finibus mauris vestibulum. Sed eu lectus libero.
        Vestibulum non consequat metus. Morbi luctus pharetra ex at gravida.
        Morbi gravida iaculis mauris vel feugiat. Duis lacinia ac eros non
        blandit. Nulla tempus tortor et mauris feugiat, vitae consequat leo
        ultrices. Proin vitae felis nisi. Donec ut libero accumsan, pulvinar
        nisi eu, rutrum nisi. Vestibulum lacus quam, euismod at vestibulum eget,
        eleifend nec tortor. Vivamus pharetra vehicula massa, bibendum finibus
        nibh sollicitudin quis.
      </div>
    </div>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: "5%",
    height: "90%",
    display: "flex",
    flexDirection: "column",
    background: "white",
    overflowX: "scroll",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 24,
  },
  text: {
    fontSize: 12,
  },
  link: {
    fontSize: 12,
  },
});

export default MyDocument;
