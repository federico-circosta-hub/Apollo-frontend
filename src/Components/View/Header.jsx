import password from './../img/icon/padlock.png'

export default function Header(props) {

    return (
        <nav class="navbar bg-body-tertiary" >
            <div class="container-fluid" >
                <a class="navbar-brand" href="#">
                    <img src="https://upload.wikimedia.org/wikipedia/it/thumb/0/04/Logo_Universit%C3%A0_degli_Studi_di_Milano.svg/1200px-Logo_Universit%C3%A0_degli_Studi_di_Milano.svg.png" alt="Logo" width="25" height="25" class="d-inline-block align-text-top" />
                </a>
                <div style={{ 'text-align': 'center' }}>Roberta Gualtierotti (physician) <img src={password} style={{ width: 25 }} /></div>
                <button type="button" class="btn btn-danger" onClick={props.logout}>Logout</button>
            </div>
        </nav>
    )
}