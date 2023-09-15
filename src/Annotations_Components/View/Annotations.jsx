import { useNavigate } from "react-router-dom"

export default function Annotations() {

    const navigate = useNavigate()

    return (
        <div>
            <div className="box-bianco" style={style.box}>
                <div>
                    <h3>Annotations</h3>
                </div>
                <div>
                    <button class="btn btn-primary" onClick={() => navigate(-1)}>Indietro</button>
                </div>
            </div>

        </div>
    )
}

const style = {

    box: {
        justifyContent: 'space-between',
        width: '95%',
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1.5%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
}
