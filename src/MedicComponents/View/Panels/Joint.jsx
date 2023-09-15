import { useContext, useEffect, useState } from "react"
import { NewVisitContext } from "../../Model/NewVisitContext"
import { PatientContext } from "../../Model/PatientContext"
import NoContextModal from "../Modals/NoContextModal"
import 'dayjs/locale/it';
import { Link } from "react-router-dom"
import EcographImages from "../OtherComponents/EcographImages"
import GenerateImages from "../../Model/GenerateImages"
import { Modal } from "react-bootstrap"
import { RefreshButton } from "../../View/OtherComponents/RefreshButton"
import JointVisitQuestions from "../../View/OtherComponents/JointVisitQuestions"
import { useNavigate } from "react-router-dom"
import a from '../../img/example_gin/1.jpg'
import b from '../../img/example_gin/2.jpg'
import c from '../../img/example_gin/3.jpg'
import { CurrentJointContext } from "../../Model/CurrentJointContext"



export default function Joint(props) {

    const { newVisit, setNewVisit } = useContext(NewVisitContext)
    const { selectedPatient } = useContext(PatientContext)
    const { currentJoint, setCurrentJoint } = useContext(CurrentJointContext)

    const [joint, setJoint] = useState(null)
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [showModal, setShowModal] = useState(false)
    const [selectedImages, setSelectedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

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
        setNewVisit(newVisit)
        setCurrentJoint('')
        console.log(newVisit)
    }

    const deleteJoint = () => {
        console.log('Joint', 'deleteJoint', 'currentJoint =', currentJoint)
        setCurrentJoint('')
        newVisit.deleteJoint(joint.jointName)
        setNewVisit(newVisit)
        navigate('/newVisit/jointSelection')
    }

    const loadJoint = async () => {
        let j = newVisit.getJoint(currentJoint)
        setJoint(j)
        let images = []
        let selectedImages = []
        if (j.images == undefined) {
            if (j.jointName == 'Ginocchio dx') {
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

    return (selectedPatient !== null) ? (
        <div>
            <div className="box-bianco" style={style.box}>
                <div style={{ display: "flex", justifyContent: 'space-between', width: '99%' }}>
                    <div style={{ position: "absolute", top: '10%', right: '4%' }} >
                        <RefreshButton onClick={handleRefresh} loading={isLoading} />
                    </div>
                    <div style={{ overflow: 'auto', height: '77vh', width: '40%', textAlign: 'center', border: '1px solid black', borderRadius: '20px', }}>
                        <EcographImages handleClick={(e) => openModal(e)} selectedImages={selectedImages} setSelectedImages={setSelectedImages} photos={photos} joint={{ joint, setJoint }} />
                    </div>
                    <div style={{ height: '77vh', width: '58%', }}>
                        {joint != null ? <JointVisitQuestions joint={joint} setJoint={setJoint} /> : 'Caricamento...'}
                    </div>



                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', width: '95%', alignItems: "center" }}>
                    <div>
                        <button style={style.forwardButton} class="btn btn-danger btn-lg" onClick={() => deleteJoint()}>Cancel</button>
                    </div>
                    <div>
                        <Link to={'/newVisit/jointSelection'} style={style.forwardButton} class="btn btn-success btn-lg" onClick={end}>End</Link>
                    </div>
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
        height: '90vh',
        borderRadius: '15px',
        background: 'white',
        margin: 'auto',
        marginTop: '1%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '2%'
    },
    horizontalLine: {
        height: 1,
        backgroundColor: 'grey',
        width: '60%',
        borderRadius: 15,
        margin: 0,

    }
}


