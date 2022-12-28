import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import MainContext from '../../../context/MainContext'

const Services = () => {
    const [services, setServices] = useState([])
    const navigate = useNavigate()
    const { setAlert } = useContext(MainContext)
    const [refresh, setRefresh] = useState(false)

    const handleDelete = (id) => {
        axios.delete('/api/services/delete/' + id)
        .then(resp => {
            setAlert({
                message: resp.data,
                status: 'success'
            })
            setRefresh(!refresh)

            window.scrollTo(0, 0)

            setTimeout(() => {
                setAlert({
                    message: ''
                })
            }, 2000)
        })
        .catch(error => {
            console.log(error)

            setAlert({
                message: error.response.data,
                status: 'danger'
            })

            if (error.response.status === 401)
                navigate('/login')
        })
    }

    useEffect(() => {
        axios.get('/api/services/')
            .then(resp => setServices(resp.data))
            .catch(error => {
                console.log(error)
                setAlert({
                    message: error.response.data,
                    status: 'danger'
                })
            })
    }, [refresh, setAlert])

    return (
        <>
            <div className="d-flex justify-content-between page-heading">
                <h1>Paslaugos</h1>
                <Link 
                    to="/admin/services/new" 
                    className="btn btn-light"
                    style={{ width: '175px', height: '40px'}}
                    
                >
                    +Nauja paslauga
                </Link>
            </div>

        {services ? 
                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Pavadinimas</th>
                            <th>Paslaugos trukmė</th>
                            <th>Paslaugos kaina</th>
                            <th>Salonas</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map(service => 
                            <tr key={service.id}>
                                <td>{service.id}</td>
                                <td>{service.name}</td>
                                <td>{service.duration}</td>
                                <td>{service.price}</td>
                                <td>{service.saloon?.name}</td>
                                <td>
                                <Link 
                                    to={'/admin/services/edit/' + service.id} 
                                    className="btn btn-light  me-2">Redaguoti
                                </Link>
                                <button 
                                    onClick={() => handleDelete(service.id)} 
                                    className="btn btn-light">Trinti
                                </button>
                            </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             : 
                <h3>Nėra registruotų paslaugų</h3>
            }
        </>
    )
}

export default Services