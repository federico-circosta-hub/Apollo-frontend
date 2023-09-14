import { useState } from "react"
import PropTypes from "prop-types"
import unimi from '../../img/logo_unimi.png';
import ospedale from '../../img/ospedale-loghi.jpeg';

export default function Login({ setName }) {

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [display, setDisplay] = useState({ "display": "none" })
    const [disabled, setDisabled] = useState(false)

    const handleSubmit = async (e) => {
        setDisabled(true)
        e.preventDefault()
        setTimeout(() => {
            if (username == 'Federico' && password == '123') {
                console.log('vero, username = ' + username + " password = " + password)
                setName('Roberta Gualtierotti (physician)')
            } else {
                setDisplay({ "display": "block" })
            }
            setDisabled(false)
        }, 2000)

    }



    return (
        <div style={style.box}>
            <div style={{ paddingTop: '5%' }}><h2>Autenticarsi</h2></div>

            <br />

            <div style={{ padding: '3%', display: 'grid', gridTemplateColumns: '1fr 1fr', justifyContent: 'space-around', alignItems: 'center' }}>
                <div >
                    <img src={unimi} alt="logo_unimi" style={{ maxWidth: '90%', height: 'auto', }} />
                </div>
                <div >
                    <img src={ospedale} alt="logo_unimi" style={{ maxWidth: '90%', height: 'auto' }} />
                </div>
            </div>
            <br />
            <br />
            <div style={{
                justifyContent: 'center',
                alignItems: 'center', display: 'flex',
            }}>
                <form onSubmit={handleSubmit} >
                    <div className="input-group mb-3">
                        <input type='text' placeholder='username' onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="input-group mb-3">
                        <input type='password' placeholder='password' onChange={e => setPassword(e.target.value)} />
                    </div>
                    <div className="input-group mb-3">
                        <button className="btn btn-primary" type='submit' disabled={disabled} style={{ margin: 'auto' }}>
                            Login
                        </button>
                    </div>
                    <div class="alert alert-warning" role="alert" style={display}>
                        Credenziali errate
                    </div>
                </form>
            </div>
        </div>
    )
}

Login.propTypes = {
    setName: PropTypes.func.isRequired
}

const style = {
    box: {
        width: '40%',
        height: 'fit-content',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '10%',
        display: 'flex',
        flexDirection: 'column',
        alignText: 'center',
        //justifyContent: 'center',
        alignItems: 'center'
    }
}