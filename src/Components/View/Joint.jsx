import { useContext, useEffect, useState } from "react"
import { NewVisitContext } from "../Model/NewVisitContext"
import { PatientContext } from "../Model/PatientContext"
import HeaderPatient from "./HeaderPatient"
import NoContextModal from "./NoContextModal"
import 'dayjs/locale/it';
import { Link } from "react-router-dom"
import JointModel from "../Model/JointModel"
import EcographImages from "./EcographImages"
import GenerateImages from "../Model/GenerateImages"
import { Modal } from "react-bootstrap"
import { RefreshButton } from "./RefreshButton"
import JointVisitQuestions from "./JointVisitQuestions"
import { useNavigate } from "react-router-dom"
import trash from './../img/icon/recycle-bin.png'
import a from '../img/example_gin/1.jpg'
import b from '../img/example_gin/2.jpg'
import c from '../img/example_gin/3.jpg'



export default function Joint(props) {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { selectedPatient } = useContext(PatientContext)

    const [joint, setJoint] = useState(new JointModel())
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showModal, setShowModal] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const [panel, setPanel] = useState(1)

    const navigate = useNavigate()

    useEffect(() => {
        loadJoint();
    }, [])


    const end = () => {
        if (newVisit.jointPresence(joint.jointName)) {
            newVisit.deleteJoint(joint.jointName)
        }
        joint.setImages(photos)
        joint.setSelectedImages(selectedImages)
        setJoint(joint)
        newVisit.addJoint(joint)
        newVisit.setCurrentJoint('')
        setNewVisit(newVisit)
    }

    const forward = () => {
        let n = panel
        setPanel(n + 1)
    }

    const back = () => {
        if (panel == 1) {
            end()
            navigate('/visit/newVisitInPresence/jointSelection')
        }
        let n = panel
        setPanel(n - 1)
    }

    const deleteJoint = () => {
        console.log('Joint', 'deleteJoint', 'currentJoint =', newVisit.currentJoint)
        newVisit.setCurrentJoint('')
        newVisit.deleteJoint(joint.jointName)
        setNewVisit(newVisit)
    }

    const loadJoint = async () => {
        let j = newVisit.getJoint(newVisit.currentJoint)
        setJoint(j)
        let images = []
        let selectedImages = []
        if (j.images == undefined) {
            if (j.jointName == 'Right knee') {
                images.push({ link: 'https://dummyimage.com/1024x768/000/fff.jpg&text=RightKnee0' })
                images.push({ link: a })
                images.push({ link: b })
                images.push({ link: c })
                images.push({ link: 'https://dummyimage.com/1024x768/000/fff.jpg&text=RightKnee4' })
            } else {
                images = await GenerateImages(j.jointName)
            }
        } else {
            images = j.images
            selectedImages = j.selectedImages
        }
        setPhotos(images)
        setSelectedImages(selectedImages)
    }

    const openModal = (e) => {
        let index = Number(e.target.alt.substring(e.target.alt.length - 1, e.target.alt.length))
        console.log(photos[index])
        setCurrentPhotoIndex(index);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };



    const handleRefresh = async () => {
        setIsLoading(true)
        let arr = await GenerateImages()
        setPhotos(prevState => [...prevState, arr])
        setSelectedImages([])
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }

    const displayNavButtons = () => {
        if (panel == 1) {
            return (
                <div>
                    <button style={style.forwardButton} class="btn btn-success btn-lg" onClick={forward}>Forward</button>
                </div>
            )
        } else {
            return (
                <div>
                    <Link to={'/visit/newVisitInPresence/jointSelection'} style={style.forwardButton} class="btn btn-success btn-lg" onClick={end}>End</Link>
                </div>
            )
        }
    }

    return (selectedPatient !== null) ? (
        <div>
            <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1%' }}>
                <HeaderPatient />
            </div>
            <div className="box-bianco" style={style.box}>
                <div>
                    <h2>{joint.jointName}</h2>
                </div>
                <div style={{ position: "absolute", top: '16%', right: '4%' }} >
                    <RefreshButton onClick={handleRefresh} loading={isLoading} />
                </div>
                <div style={{ overflow: 'auto', width: '97%', textAlign: 'center', border: '1px solid black', borderRadius: '20px', }}>
                    <EcographImages handleClick={(e) => openModal(e)} selectedImages={selectedImages} setSelectedImages={setSelectedImages} photos={photos} joint={{ joint, setJoint }} />
                </div>

                <JointVisitQuestions panel={panel} joint={joint} setJoint={setJoint} />

                <div style={{ display: 'flex', marginBottom: '1.5%', justifyContent: 'space-between', width: '95%', alignItems: "center" }}>
                    <div>
                        <button style={style.forwardButton} class="btn btn-primary btn-lg" onClick={back}>Back</button>
                    </div>
                    <div>
                        <Link to={'/visit/newVisitInPresence/jointSelection'} onClick={() => deleteJoint()} class="btn btn-danger"><img style={{ width: 22, filter: `invert(100%)` }} src={trash} /> Delete joint</Link>
                    </div>
                    {displayNavButtons()}
                </div>
            </div>
            <Modal size="sm" show={showModal} onHide={closeModal} centered >
                <Modal.Body>
                    <img src={photos[currentPhotoIndex] != undefined ? photos[currentPhotoIndex].link : null} alt={`Photo ${currentPhotoIndex}`} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                </Modal.Body>
            </Modal>
        </div>
    )
        :
        (
            <NoContextModal what={" un paziente "} service={" nuova articolazione "} />
        )
}


const style = {
    buttons: {
        width: '47%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'right',
        justifyContent: 'space-around',
        marginBottom: '5%',
        border: '1px solid black',
        borderRadius: '20px',
        padding: '4%'
    },


    box: {
        width: '98%',
        height: '82vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'grey',
        width: '60%',
        borderRadius: 15,
        margin: 0,

    }
}


